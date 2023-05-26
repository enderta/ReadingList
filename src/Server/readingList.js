const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');



const app = express();


app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "readinglist",
    password: "ender",
    port: 5432,
});

app.use(bodyParser.json());

app.get('/books', async(req, res) => {
    //search for all books
    const searchTerm = req.query.search;
    try{
        if(!searchTerm){
            const allBooks = await pool.query("SELECT * FROM books");
            res.status(200).json({
                status: "success",
                message:`${allBooks.rows.length} books found`,
                data: allBooks.rows
            });

        }else{
            //serach for a specific book and author

            const allBooks = await pool.query("SELECT * FROM books WHERE title ILIKE $1 OR author ILIKE $1", [`%${searchTerm}%`]);
            res.status(200).json({
                status: "success",
                message:`${allBooks.rows.length} books found`,
                data: allBooks.rows
            });
        }
    }catch(err){
        console.log(err.message);

    }

});

app.get('/books/:id', async(req, res) => {

    const {id} = req.params;
    try{
        const book = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
       res.status(200).json({
              status: "success",
                message:`${book.rows.length} book found`,
                data: book.rows
            });
    }catch(err){
        console.log(err.message);
       }
});

app.post('/books', async(req, res) => {
    const {title, author, image_url, is_read} = req.body;
    try{
        const newBook = await pool.query("INSERT INTO books (title, author, image_url, is_read) VALUES ($1, $2, $3, $4) RETURNING *", [title, author, image_url, is_read]);
        res.status(200).json({
            status: "success",
            message:`${newBook.rows.length} book added`,
            data: newBook.rows
        });
    }
    catch(err){
        console.log(err.message);
    }

}
);

app.put('/books/:id', async(req, res) => {
    const {id} = req.params;
    const {title, author, image_url, is_read} = req.body;
    try{
        const updateBook = await pool.query("UPDATE books SET title = $1, author = $2, image_url = $3, is_read = $4 WHERE id = $5 RETURNING *", [title, author, image_url, is_read, id]);
        res.status(200).json({
            status: "success",
            message:`${updateBook.rows.length} book updated`,
            data: updateBook.rows
        });
    }
    catch(err){
        console.log(err.message);
    }

}
);

app.delete('/books/:id', async(req, res) => {
    const {id} = req.params;
    try{
        const deleteBook = await pool.query("DELETE FROM books WHERE id = $1", [id]);
        res.status(200).json({
            status: "success",
            message:`${deleteBook.rows.length} book deleted`,
            data: deleteBook.rows
        });
    }
    catch(err){
        console.log(err.message);
    }
}
);

app.listen(5000, () => {
    console.log(`http://localhost:5000`+` is running`);
}
);



