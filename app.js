const express = require('express')
const app = express()
const jwt = require("jsonwebtoken")
const bodyParser = require('body-parser');

app.use(express.json())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const knex = require('knex')
    ({

        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: 'rexweb@123',
            database: 'employeeDB'
        }

    })



//create table
knex.schema.hasTable("Customer").then((exist) => {
    if (!exist) {
        return knex.schema.createTable("Customer", function (table) {
            table.increments("id").primary(),
                table.string("Name", 100)
            table.string("email", 100)
            table.string("gender", 100)
            table.integer("contact", 100)
            table.string("password", 100)
        })
    }
})



//API to insert data into te tablr (login/signup)
app.post("/register", (req, res) => {
    const data = {
        Name: req.body.Name,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender,
        contact: req.body.contact
    }
    knex("Customer").insert(data).then(() => {
        res.send(data)
    }).catch((err) => {
        console.log(err)
    })
})



//API to get the table data
app.get("/Customer", (req, res) => {
    knex.select("*").from("Customer").then((data) => {
        res.send(data)
    }).catch((err) => {
        console.log(err)
    })
})



//API to login 
app.post("/Login", (req, res) => {
    knex.select("*").from("Customer").then((data) => {
        let a = false
        let email = req.body.email
        let password = req.body.password
        for (i of data) {
            if (i.email == email && i.password == password) {
                a = true

                let token = jwt.sign({ password: i.password }, 'nikita')
                return res.json({ jwt: token })
            }
        } if (a) {
            res.send("login successfully")
        } else {
            res.send("your email or password is wrong")
        }
    })
})



//API 
app.patch("/upt/:id", (req, res) => {
    const token = jwt.verify(req.headers.authorization, 'nikita')
    knex.select("*").from("Customer").where({ password: token.password }).where("id", req.params.id).update(req.body).then((data) => {
        res.send("updated")
        console.log(data)

    }).catch((err) => {
        console.log(err)
    })
})



app.delete("/dlt/:id", (req, res) => {
    const token = jwt.verify(req.headers.authorization, 'nikita')
    knex.select("*").from("Customer").where("id", req.params.id).del().then((data) => {
        res.send("deleted")
    }).catch((err) => {
        console.log(err)
    })
})



//Books
//Creating table for books
knex.schema.hasTable("Books").then((exist) => {
    if (!exist) {
        return knex.schema.createTable("Books", function (table) {
            table.increments("id").primary()
            table.string("bookName", 100)
            table.string("author", 100)
            table.integer("price", 100)
            table.integer("edition", 100)
        })
    }
})



//API to insert data into the table
app.post("/insert", (req, res) => {
    const data = {
        "bookName": req.body.bookName,
        "author": req.body.author,
        "price": req.body.price,
        "edition": req.body.edition
    }
    knex.select("*").from('Books').insert(data).then(() => {
        res.send(data)
    }).catch((err) => {
        console.log(err)
    })
})



app.get("/books", (req, res) => {
    knex.select("*").from("Books").then((data) => {
        res.send(data)
    }).catch((err) => {
        console.log(err)
    })
})



app.patch("/update/:id", (req, res) => {
    knex.select("*").from("Books").where("id", req.params.id).update(req.body).then((data) => {
        console.log(data)
        res.send("updated")

    }).catch((err) => {
        console.log(err)
    })
})



app.delete("/delete/:id", (req, res) => {
    knex.select("*").from("Books").where("id", req.params.id).del().then((data) => {
        res.send(data)
    }).catch((err) => {
        console.log(err)
    })
})



//API to purchase book
knex.schema.hasTable("Purchase").then((exist) => {
    if (!exist) {
        return knex.schema.createTable("Purchase", (table) => {
            table.increments("id").primary()
            table.string("bookName", 100)
            table.integer("price", 100)
        })
    }
})

app.post("/pur/:id", (req, res) => {
    knex("Purchase").insert(req.params.id).then(() => {
        knex.select("Purchase.id", "bookName", "price").from("Purchase")
            .join("Books", function () {
                this.on("Purchase.id", "=", "Books.id")
            }).then((data) => {
                res.send(data)
            }).catch((err) => {
                console.log(err)
            })
    })
})

// app.post("/purchase/:id", (req, res) => {

//     knex("cart").insert(req.params.id).then(() => {
//         knex.select("cart.id", "pName", "BrandName", "Price", "Quantity", "Model").from("cart")
//             .join("Product", function () {
//                 this.on("cart.id", "=", "Product.id")
//             }).then((data) => {
//                 res.send(data)
//             }).catch((err) => {
//                 console.log(err)
//             })
//     })
// })

//API to wishlist an item
knex.schema.hasTable("wishlist").then((exist)=>{
    if(!exist){
        return knex.schema.createTable("wishlist",(table)=>{
            table.increments("id").primary()
            table.string("bookName", 100)
            table.string("author", 100)
            table.integer("price", 100)
            table.integer("edition", 100)
        })
    }
})

app.post("/wishlist/:id", (req, res) => {

    knex("wishlist").insert(req.params.id).then(() => {
        knex.select("wishlist.id", "bookName", "author", "price","edition").from("wishlist")
            .join("Books", function () {
                this.on("wishlist.id", "=", "Books.id")
            }).then((data) => {
                res.send(data)
            }).catch((err) => {
                console.log(err)
            })
    })
})


app.listen(4000, (req, res) => {
    console.log("Server is working at port: http://localhost:4000")
})