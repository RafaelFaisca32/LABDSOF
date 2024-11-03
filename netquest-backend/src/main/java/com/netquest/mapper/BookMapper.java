package com.netquest.mapper;

import com.netquest.model.Book;
import com.netquest.controller.dto.BookDto;
import com.netquest.controller.dto.CreateBookRequest;

public interface BookMapper {

    Book toBook(CreateBookRequest createBookRequest);

    BookDto toBookDto(Book book);
}