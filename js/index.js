document.addEventListener("DOMContentLoaded", function() {
    // When the page loads, get a list of books from http://localhost:3000/books 
    // and display their titles by creating a li for each book and adding 
    // each li to the ul#list element.
    const currUser = {"id":1, "username":"pouros"}

    fetch('http://localhost:3000/books')
    .then(r => r.json())
    .then(books => {
        displayBook(books[0])
        books.forEach((book)=>{
            displayList(book)    
        })
        
    })

    function displayList(book){
        const ul = document.querySelector("#list")
        
        const li = document.createElement("li")
        li.textContent = book.title
        
        ul.append(li)

        li.addEventListener("click",()=>{
            displayBook(book)
        })
    }

    function displayBook(book){
        // When a user clicks the title of a book, display the book's 
        // thumbnail, description, and a list of users who have liked 
        // the book. This information should be displayed in the div#show-panel element.
        const panel = document.querySelector("#show-panel")
        panel.innerHTML = ""

        const image = document.createElement("img")
        const title = document.createElement("h1")
        const description = document.createElement("p")
        const h3 = document.createElement("h3")
        const likeButton = document.createElement("button")

        image.src = book.img_url
        title.textContent = book.title
        description.textContent = book.description
        h3.textContent = "Liked by: "

        let inLikes = false
        for(let index in book.users){
            // console.log(book.users[index].username, currUser.username)
            if(book.users[index].username === currUser.username){
                inLikes = true
            }
        }
        if(inLikes){
            likeButton.textContent = "unLike"
        }
        else{
            likeButton.textContent = "Like"
        }

        panel.append(image,title,description, h3)

        book.users.forEach((user)=>{
            const userHtml = document.createElement("p")
            userHtml.textContent = user.username

            panel.append(userHtml)
        })
        panel.append(likeButton)

        // console.log(inLikes)
        likeButton.addEventListener("click",()=>{
            if(!inLikes){
                console.log("Adding")
                book.users.push(currUser)
                fetch(`http://localhost:3000/books/${book.id}`,{
                    method: "PATCH",
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        users: book.users
                    })
                })
                .then(r=>r.json())
                .then(newBook =>{
                    console.log(newBook)
    
                    displayBook(newBook)
                })
            }
            else{
                book.users = book.users.filter((user)=>{
                    if(user.username === currUser.username){
                        return false
                    }
                    return true
                })
                fetch(`http://localhost:3000/books/${book.id}`,{
                    method: "PATCH",
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        users: book.users
                    })
                })
                .then(r=>r.json())
                .then(newBook =>{
                    displayBook(newBook)
                })
            }
        })

        

    }

});
