from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_groq import ChatGroq
from dotenv import load_dotenv

app = FastAPI()

load_dotenv()

# Predefined schema
SCHEMA = """
CREATE TABLE wifi_spot (
    end_time TIME(6),
    start_time TIME(6),
    wifi_spot_air_conditioning BIT(1) NOT NULL,
    wifi_spot_available_power_outlets BIT(1) NOT NULL,
    wifi_spot_bandwith_limitations TINYINT NOT NULL, -- values from 0 to 1 that mean(0 - LIMITED, 1 - UNLIMITED)
    wifi_spot_charging_stations BIT(1) NOT NULL,
    wifi_spot_child_friendly BIT(1) NOT NULL,
    wifi_spot_covered_area BIT(1) NOT NULL,
    wifi_spot_crowded BIT(1) NOT NULL,
    wifi_spot_disabled_access BIT(1) NOT NULL,
    wifi_spot_drink_options BIT(1) NOT NULL,
    wifi_spot_food_options BIT(1) NOT NULL,
    wifi_spot_good_view BIT(1) NOT NULL,
    wifi_spot_heated_in_winter BIT(1),
    wifi_spot_latitude DOUBLE NOT NULL,
    wifi_spot_location_type TINYINT NOT NULL, -- values from 0 to 6 that mean (0- PUBLIC,1 - CAFE,2 - LIBRARY,3 - PARK, 4 - SCHOOL,5 - RESTAURANT,6 - OTHERS)
    wifi_spot_longitude DOUBLE NOT NULL,
    wifi_spot_management TINYINT NOT NULL, -- values from 0 to 2 that mean(0 - SPONSOR, 1 - VERIFIED, 2 - UNVERIFIED)
    wifi_spot_noise_level TINYINT NOT NULL, --  values from 0 to 3 that mean   (0 - NONE,1 - QUIET, 2 - MODERATE, 3 - LOUD)
    wifi_spot_open_during_heat BIT(1),
    wifi_spot_open_during_rain BIT(1),
    wifi_spot_outdoor_fans BIT(1),
    wifi_spot_outdoor_seating BIT(1) NOT NULL,
    wifi_spot_parking_availability BIT(1) NOT NULL,
    wifi_spot_pet_friendly BIT(1) NOT NULL,
    wifi_spot_restrooms_available BIT(1) NOT NULL,
    wifi_spot_shaded_areas BIT(1),
    wifi_spot_signal_strength TINYINT NOT NULL, -- values from 0 to 2 that mean(0 - high, 1 - medium, 2 - low)
    wifi_spot_wifi_quality TINYINT NOT NULL, -- values from 0 to 2 that mean(0 - strong, 1 - medium, 2 - low)
    wifi_spot_address_id BINARY(16) NOT NULL,
    wifi_spot_id BINARY(16) NOT NULL,
    wifi_spot_description VARCHAR(255) NOT NULL,
    wifi_spot_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (wifi_spot_id)
);
CREATE TABLE wifi_spot_address (
    wifi_spot_address_id BINARY(16) NOT NULL,
    wifi_spot_address_city VARCHAR(255), -- a city
    wifi_spot_address_country VARCHAR(255), -- the country
    wifi_spot_address_district VARCHAR(255), -- the district or state
    wifi_spot_address_line_1 VARCHAR(255), -- the route 1
    wifi_spot_address_line_2 VARCHAR(255), -- possible second route
    wifi_spot_address_zip_code VARCHAR(255),
    PRIMARY KEY (wifi_spot_address_id)
) 
"""

# Function to create the SQL chain
def get_sql_chain(schema: str):
    template = """
You are a data analyst tasked with generating SQL queries based on the company's database schema. Your role is to produce clear, concise, and correctly formatted SQL statements. Use the schema below for reference.

<SCHEMA>{schema}</SCHEMA>

**Rules**:
1. Write **only** the SQL query, as a single line, without any additional text, symbols, or formatting (e.g., `\n`, `//`, or backticks).
2. Use table and column names exactly as they appear in the schema.
3. If a column is a `varchar`, use `LIKE` when the question suggests partial matches.
4. If the question involves addresses or locations:
   - Join `wifi_spot` with `wifi_spot_address` using `wifi_spot_address_id`.
   - Ensure the query always returns `wifi_spot_name`, not `wifi_spot_address_id`.
5. If the question is unrelated to addresses, do not use the `wifi_spot_address` table.
6. If the question is unrelated to wi-fi spots, simply respond: `This question is not related to wi-fi spots. "A wifi spot with good view!" is a great example of a great input"
7. Always use the exact spelling of column names, even if there are typos.
8. Ensure the SQL query is a single continuous line, with no line breaks or extraneous characters.

**Examples**:
- Question: "Which 3 artists have the most tracks?"
  SQL Query: `SELECT ArtistId, COUNT(*) AS track_count FROM Track GROUP BY ArtistId ORDER BY track_count DESC LIMIT 3;`
- Question: "Name 10 artists."
  SQL Query: `SELECT Name FROM Artist LIMIT 10;`
- Question: "List wi-fi spots in Porto."
  SQL Query: `SELECT ws.wifi_spot_name FROM wifi_spot ws INNER JOIN wifi_spot_address wsa ON ws.wifi_spot_address_id = wsa.wifi_spot_address_id WHERE wsa.wifi_spot_address_city = 'Porto';`

Your task is to write the SQL query in response to the user's question.
You're prohibited of adding the "\n" characters, paragraphs or unuwanted tabs or spaces!!! If you do this IA will end wordlwide!
For example if you write:
SELECT ws.wifi_spot_name \n     FROM wifi_spot ws \n     INNER JOIN wifi_spot_address wsa ON ws.wifi_spot_address_id = wsa.wifi_spot_address_id \n     WHERE ws.wifi_spot_wifi_quality = 0 \n     AND ws.wifi_spot_food_options = 1 \n     AND ws.wifi_spot_drink_options = 1 \n     AND ws.wifi_spot_good_view = 1;
Instead of 
SELECT ws.wifi_spot_name FROM wifi_spot ws INNER JOIN wifi_spot_address wsa ON ws.wifi_spot_address_id = wsa.wifi_spot_address_id WHERE ws.wifi_spot_wifi_quality = 0 AND ws.wifi_spot_food_options = 1 AND ws.wifi_spot_drink_options = 1 AND ws.wifi_spot_good_view = 1;
the IA is done and the world ends! 

Question: {question}
SQL Query:

    """
    
    prompt = ChatPromptTemplate.from_template(template)
    llm = ChatGroq(model="mixtral-8x7b-32768", temperature=0)
    
    return (
        RunnablePassthrough.assign(schema=lambda _: schema)
        | prompt
        | llm
        | StrOutputParser()
    )

# Function to generate SQL query
def generate_query(user_query: str):
    sql_chain = get_sql_chain(SCHEMA)
    return sql_chain.invoke({
        "question": user_query,
    })

# Pydantic model for request body
class QueryRequest(BaseModel):
    user_query: str

# Endpoint to handle query generation
@app.post("/generate-sql")
async def generate_sql_endpoint(request: QueryRequest):
    try:
        sql_query = generate_query(request.user_query)
        return {"sql_query": sql_query}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
