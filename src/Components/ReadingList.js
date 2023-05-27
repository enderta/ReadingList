import React, { useState, useEffect } from 'react';
import { Button, Card, Form } from 'react-bootstrap';

function ReadingList() {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [image_url, setImageUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:5000/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                author,
                image_url,
                is_read: false,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                fetchBooks();
                setTitle("");
                setAuthor("");
                setImageUrl("");

            });
    }


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
                <div className="row" >
                    {books.map((book, index) => (
                        <div key={book.id} className="col-md-4 mb-3"  >
                            <Card
                                className={darkMode ? '' : ''} style={{ backgroundColor: darkMode ? "#070f23" : 'white' }}

                            >
                                <Card.Img
                                    variant="top"
                                    style={{ height: '300px', width: '200px' }}
                                    src={book.image_url}
                                />
                                <Card.Body >
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
                <br />
                <Card  style={{ backgroundColor: darkMode ? "#101526" : 'white',width: '20rem' }}>
                    {darkMode ? (
                        <span > Add Book
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Author</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Author"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Image URL</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Image URL"
                                    value={image_url}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                />
                            </Form.Group>
                            <br/>
                            <Button variant="outline-danger" type="submit">
                                Submit
                            </Button>
                        </Form>
                        </span>
                    ) : (
                        <span >
                            Add Book
                              <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Author</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Author"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Image URL</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Image URL"
                                    value={image_url}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>

                        </span>
                    )}
                </Card>
            </div>
        </div>
    );
}

export default ReadingList;
