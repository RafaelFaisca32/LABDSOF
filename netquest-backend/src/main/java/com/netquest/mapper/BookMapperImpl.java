package com.netquest.mapper;

import com.netquest.model.Book;
import com.netquest.controller.dto.BookDto;
import com.netquest.controller.dto.CreateBookRequest;
import org.springframework.stereotype.Service;

@Service
public class BookMapperImpl implements BookMapper {

    @Override
    public Book toBook(CreateBookRequest createBookRequest) {
        if (createBookRequest == null) {
            return null;
        }
        return new Book(createBookRequest.getIsbn(), createBookRequest.getTitle());
    }

    @Override
    public BookDto toBookDto(Book book) {
        if (book == null) {
            return null;
        }
        return new BookDto(book.getIsbn(), book.getTitle());
    }
}
