import React, { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';

function ReadingList() {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const fetchBooks = () => {
        setLoading(true);
        fetch(`http://localhost:5000/books?search=${searchTerm}`)
            .then((res) => res.json())
            .then((data) => {
                setBooks(data.data);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchBooks();
    }, [searchTerm]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.value);
    };

    const handleCheck = (index) => {
        fetch(`http://localhost:5000/books/${books[index].id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: books[index].title,
                author: books[index].author,
                image_url: books[index].image_url,
                is_read: !books[index].is_read,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                fetchBooks();
            });
    };

    const handleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('bg-dark', 'text-white');
        } else {
            document.body.classList.remove('bg-dark', 'text-white');
        }
    }, [darkMode]);

    
    return (
        <div style={{ margin: '10px' }} className="form-check form-switch">
            <div className="flex items-center justify-between">
                <Button type="button" onClick={handleDarkMode} variant="outline-success">
                    {darkMode ? (
                        <span style={{ color: 'goldenrod' }}>&#x2600; </span>
                    ) : (
                        <span style={{ color: 'darkgray' }}>&#127769;</span>
                    )}
                </Button>

                <Button
                    type="button"
                    onClick={handleDarkMode}
                    variant="outline-danger"
                    style={{ marginLeft: '10px' , alignItems:"flex-end"}}
                >
                    {darkMode ? (
                        <span style={{ color: 'goldenrod' }}> Add Book</span>
                    ) : (
                        <span style={{ color: 'goldenrod' }}>Add Book</span>
                    )}

                </Button>
            </div>

            <div className="container">
                {loading ? <h1>Loading...</h1> : null}
                <h1>Reading List</h1>
                <div className="row">
                    <div className="col-md-12">
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search"
                                aria-label="Search"
                                aria-describedby="button-addon2"
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                </div>

                <br />
                <div className="row">
                    {books.map((book, index) => (
                        <div key={book.id} className="col-md-4 mb-3">
                            <Card className={darkMode ? 'bg-secondary text-white' : ''}>
                                <Card.Img
                                    variant="top"
                                    style={{ height: '300px', width: '200px' }}
                                    src={book.image_url}
                                />
                                <Card.Body>
                                    <Card.Title>{book.title}</Card.Title>
                                    <Card.Text>{book.author}</Card.Text>
                                    {book.is_read ? (
                                        <h6
                                            className="card-subtitle mb-2 text-muted"
                                            onClick={() => handleCheck(index)}
                                        >
                                            Read: ✅
                                        </h6>
                                    ) : (
                                        <h6
                                            className="card-subtitle mb-2 text-muted"
                                            onClick={() => handleCheck(index)}
                                        >
                                            Read: ❌
                                        </h6>
                                    )}
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ReadingList;
