import React, { useState, useEffect } from "react";
import {
  Statistic,
  Icon,
  Grid,
  Container,
  Image,
  Segment,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import { authApi } from "../misc/AuthApi";
import { wifiSpotApi } from "../misc/WifiSpotApi";
import { handleLogError } from "../misc/Helpers";

function Home() {
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [wifiSpotNumbers, setNumberOfWifiSpots] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const responseUsers = await authApi.numberOfUsers();
      if (responseUsers.status === 200) setNumberOfUsers(responseUsers.data);

      const responseWifiSpots = await wifiSpotApi.getNumberWifiSpots();
      if (responseWifiSpots.status === 200)
        setNumberOfWifiSpots(responseWifiSpots.data);
    } catch (error) {
      handleLogError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Segment basic style={{ marginTop: window.innerHeight / 2 }}>
        <Dimmer active inverted>
          <Loader inverted size="huge">
            Loading
          </Loader>
        </Dimmer>
      </Segment>
    );
  }

  return (
    <Container text>
      <Grid stackable columns={2}>
        <Grid.Row>
          <Grid.Column textAlign="center">
            <Segment color="blue">
              <Statistic>
                <Statistic.Value>
                  <Icon name="user" color="grey" />
                  {numberOfUsers}
                </Statistic.Value>
                <Statistic.Label>Users</Statistic.Label>
              </Statistic>
            </Segment>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <Segment color="blue">
              <Statistic>
                <Statistic.Value>
                  <Icon name="wifi" color="grey" />
                  {wifiSpotNumbers}
                </Statistic.Value>
                <Statistic.Label>Wi-fi spots</Statistic.Label>
              </Statistic>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Image
        src="https://www.newyorkertips.com/wp-content/uploads/2016/07/Free-WiFi-Hotspots-in-NYC-800x445.jpg"
        style={{ marginTop: "2em" }}
      />
    </Container>
  );
}

export default Home;
