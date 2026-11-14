
require('dotenv').config();

const express = require('express');
const app = express();
const sql = require('mssql');

const dbConfig = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        trustServerCertificate: true
    }
};

app.use(express.json());

// Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to the Book Category API');
});

// Categories route
app.get('/categories', (req, res) => {
    res.json([
        { id: 1, name: 'Fiction' },
        { id: 2, name: 'Non-Fiction' },
        { id: 3, name: 'Biography' }
    ]);
});

// About route
app.get('/about', (req, res) => {
    res.send('Hi! I am a Year 1 IT student. I am learning how to build web applications using Node.js and Express.');
});


// TUTORIAL 1
// GET /authors
app.get('/authors', async (req, res) => {
    let connection;

    try {
        connection = await sql.connect(dbConfig);

        const result = await connection.request().query(
            'SELECT AuthorID, Name FROM Author'
        );

        res.status(200).json(result.recordset);
    }
    catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
    }
    finally {
        if (connection) {
            await connection.close();
        }
    }
});


// GET /authors/:id
app.get('/authors/:id', async (req, res) => {
    const authorId = parseInt(req.params.id);

    if (isNaN(authorId)) {
        return res.status(400).json({ error: 'Invalid id' });
    }

    let connection;

    try {
        connection = await sql.connect(dbConfig);

        const request = connection.request();
        request.input('id', authorId);

        const sqlQuery = `
            SELECT AuthorID, Name
            FROM Author
            WHERE AuthorID = @id
        `;

        const result = await request.query(sqlQuery);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.status(200).json(result.recordset[0]);
    }
    catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
    }
    finally {
        if (connection) {
            await connection.close();
        }
    }
});


// TUTORIAL 3a
// POST /authors
app.post('/authors', async (req, res) => {
    let connection;

    try {
        connection = await sql.connect(dbConfig);

        const request = connection.request();

        request.input('id', req.body.id);
        request.input('name', req.body.name);

        const sqlQuery = `
            INSERT INTO Author (AuthorID, Name)
            OUTPUT INSERTED.*
            VALUES (@id, @name)
        `;

        const result = await request.query(sqlQuery);

        res.status(201).json(result.recordset[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
    finally {
        if (connection) {
            await connection.close();
        }
    }
});


// PUT /authors/:id
app.put('/authors/:id', async (req, res) => {
    const authorId = parseInt(req.params.id);

    if (isNaN(authorId)) {
        return res.status(400).json({ error: 'Invalid id' });
    }

    let connection;

    try {
        connection = await sql.connect(dbConfig);

        const request = connection.request();

        request.input('id', authorId);
        request.input('name', req.body.name);

        const sqlQuery = `
            UPDATE Author
            SET Name = @name
            OUTPUT INSERTED.*
            WHERE AuthorID = @id
        `;

        const result = await request.query(sqlQuery);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.status(200).json(result.recordset[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
    finally {
        if (connection) {
            await connection.close();
        }
    }
});


// TUTORIAL 3b
// DELETE /authors/:id
app.delete('/authors/:id', async (req, res) => {
    const authorId = parseInt(req.params.id);

    if (isNaN(authorId)) {
        return res.status(400).json({ error: 'Invalid id' });
    }

    let connection;

    try {
        connection = await sql.connect(dbConfig);

        const request = connection.request();

        request.input('id', authorId);

        const sqlQuery = `
            DELETE FROM Author
            WHERE AuthorID = @id
        `;

        const result = await request.query(sqlQuery);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.status(204).send();
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
    finally {
        if (connection) {
            await connection.close();
        }
    }
});

// PRACTICE 1 & 2
// GET /publishers 
app.get('/publishers', async (req, res) => {
    let connection;

    try {
        connection = await sql.connect(dbConfig);

        const result = await connection.request().query(
            'SELECT PublisherID, Name FROM Publisher'
        );

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

// GET /publishers/:id 
app.get('/publishers/:id', async (req, res) => {
    const publisherId = parseInt(req.params.id);

    if (isNaN(publisherId)) {
        return res.status(404).json({ error: 'Not found' });
    }

    let connection;

    try {
        connection = await sql.connect(dbConfig);

        const request = connection.request();
        request.input('id', publisherId);

        const sqlQuery = `
            SELECT PublisherID, Name
            FROM Publisher
            WHERE PublisherID = @id
        `;

        const result = await request.query(sqlQuery);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

// POST /publishers 
app.post('/publishers', async (req, res) => {
    let connection;

    try {
        connection = await sql.connect(dbConfig);

        const request = connection.request();

        request.input('id', req.body.id);
        request.input('name', req.body.name);

        const sqlQuery = `
            INSERT INTO Publisher (PublisherID, Name)
            OUTPUT INSERTED.*
            VALUES (@id, @name)
        `;

        const result = await request.query(sqlQuery);

        res.status(201).json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

// PUT /publishers/:id 
app.put('/publishers/:id', async (req, res) => {
    const publisherId = parseInt(req.params.id);

    if (isNaN(publisherId)) {
        return res.status(404).json({ error: 'Not found' });
    }

    let connection;

    try {
        connection = await sql.connect(dbConfig);

        const request = connection.request();

        request.input('id', publisherId);
        request.input('name', req.body.name);

        const sqlQuery = `
            UPDATE Publisher
            SET Name = @name
            WHERE PublisherID = @id
        `;

        const result = await request.query(sqlQuery);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.status(200).json({ updated: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

// DELETE /publishers/:id 
app.delete('/publishers/:id', async (req, res) => {
    const publisherId = parseInt(req.params.id);

    if (isNaN(publisherId)) {
        return res.status(404).json({ error: 'Not found' });
    }

    let connection;

    try {
        connection = await sql.connect(dbConfig);

        const request = connection.request();
        request.input('id', publisherId);

        const sqlQuery = `
            DELETE FROM Publisher
            WHERE PublisherID = @id
        `;

        const result = await request.query(sqlQuery);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

// START SERVER
app.listen(3000, () => {
    console.log('Listening on port 3000');
});
