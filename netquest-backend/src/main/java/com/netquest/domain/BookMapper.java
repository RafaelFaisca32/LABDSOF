package com.netquest.domain;

public interface BookMapper {

    Book toBook(CreateBookRequest createBookRequest);

    BookDto toBookDto(Book book);
}