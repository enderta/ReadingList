import {React,useState,useEffect} from 'react';
import {Modal,Card} from "react-bootstrap";



function ReadingList(props) {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const fetchBooks = () => {
        setLoading(true);
        fetch(`http://localhost:5000/books?search=${searchTerm}`)
            .then(res => res.json())
            .then(data => {
                setBooks(data.data);
                setLoading(false);
            });

    }
    console.log(books)
    useEffect(() => {
        fetchBooks();

    }, [searchTerm]);

    const handleSearch = e => {
        e.preventDefault();
        setSearchTerm(e.target.value);
    }
    const handleCheck = (index) => {
        fetch(`http://localhost:5000/books/${books[index].id}`, {
            method:"PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: books[index].title,
                author: books[index].author,
                image_url: books[index].image_url,
                is_read: !books[index].is_read
            }
            )
        })
            .then(res => res.json())
            .then(data => {
                fetchBooks();
               // window.location.reload();
            }
            );
    }
    const handleDarkMode = () => {
        setDarkMode(!darkMode);
    }
    return (
        <div>
            {
                loading ? <h1>Loading...</h1> :
                    <div>
                        <h1>Reading List</h1>
                        <div className={'container'}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <br />
                            <div className={'row'}>
                                {books.map((book, index) => (
                                    <div className={'col-md-4'} key={index}>
                                        <br />
                                        <div className="card">
                                            <Card >
                                                <Card.Img variant="top" src={book.image_url} />
                                                <Card.Body>
                                                    <Card.Title>{book.title}</Card.Title>
                                                    <Card.Text>
                                                        {book.author}
                                                    </Card.Text>
                                                    <button className={'btn btn-primary'} onClick={() => handleCheck(index)}>{book.is_read ? 'Uncheck' : 'Check'}</button>
                                                </Card.Body>

                                            </Card>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

            }
        </div>
    );
}

export default ReadingList;