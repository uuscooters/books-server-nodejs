/* eslint-disable no-unreachable */
const { nanoid } = require('nanoid');
const books = require('./books');

/**
 * #Kriteria 1: API dapat menyimpan buku
*/
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  //  - Client tidak melampirkan properti name pada request body.
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // - Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  // Generic Error
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

/**
 * #Kriteria 2: API dapat menampilkan seluruh buku.
 * */
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  // query Search by name
  if (name !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        books: books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())).map((nm) => ({
          id: nm.id,
          name: nm.name,
          publisher: nm.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  // query reading true or false
  if (reading !== undefined) {
    const isRead = reading === '1';
    if (isRead === true) {
      const response = h.response({
        status: 'success',
        data: {
          books: books.filter((book) => book.reading === isRead).map((b) => ({
            id: b.id,
            name: b.name,
            publisher: b.publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }
  }

  if (reading !== undefined) {
    const notRead = reading === '0';
    if (notRead === false) {
      const response = h.response({
        status: 'success',
        data: {
          books: books.filter((book) => book.reading === notRead).map((b) => ({
            id: b.id,
            name: b.name,
            publisher: b.publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }
  }

  // query finished true or false
  if (finished !== undefined) {
    const isFinish = finished === '1';
    if (isFinish === true) {
      const response = h.response({
        status: 'success',
        data: {
          books: books.filter((book) => book.finished === isFinish).map((clear) => ({
            id: clear.id,
            name: clear.name,
            publisher: clear.publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }
  }

  if (finished !== undefined) {
    const notFinish = finished === '0';
    if (notFinish === false) {
      const response = h.response({
        status: 'success',
        data: {
          books: books.filter((book) => book.finished === notFinish).map((clear) => ({
            id: clear.id,
            name: clear.name,
            publisher: clear.publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }
  }

  return {
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  };
};

/**
 * #Kriteria 3: API dapat menampilkan detail buku
 */
const getBooksByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((b) => b.id === id).map((bk) => ({
    id: bk.id,
    name: bk.name,
    year: bk.year,
    author: bk.author,
    summary: bk.summary,
    publisher: bk.publisher,
    pageCount: bk.pageCount,
    readPage: bk.readPage,
    finished: bk.finished,
    reading: bk.reading,
    insertedAt: bk.insertedAt,
    updatedAt: bk.updatedAt,
  }))[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

/**
 * #Kriteria 4 : API dapat mengubah data buku
 */
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updateAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updateAt,
    };

    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookById = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler, getAllBooksHandler, getBooksByIdHandler, editBookByIdHandler, deleteBookById,
};
