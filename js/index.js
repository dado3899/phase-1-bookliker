document.addEventListener("DOMContentLoaded", function() {
    // When the page loads, get a list of books from 
    // http://localhost:3000/books and display their titles by 
    // creating a li for each book and adding each li to the ul#list element.
    logged_in_user = {
        id:100,
        username:"testUser"
    }

    fetch('http://localhost:3000/books')
    .then(r=>r.json())
    .then(data=>{
        // console.log(data)
        const list = document.querySelector("#list")
        data.forEach((book)=>{
            addNav(book)
        })
    })

    function addNav(book){
        const li = document.createElement('li')
        li.textContent = book.title
        list.append(li)
        li.addEventListener('click',()=>{
            display(book)
        })
    }
    // When a user clicks the title of a book, display the 
    // book's thumbnail, description, and a list of users who 
    // have liked the book. This information should be displayed in 
    // the div#show-panel element.
    function display(book){
        const panel = document.querySelector("#show-panel")
        panel.innerHTML = ""

        const thumb = document.createElement('img')
        const desc = document.createElement('p')
        const list = document.createElement('ul')
        const likeButton = document.createElement('button')
        thumb.src = book.img_url
        desc.textContent = book.description

        // .map,.forEach
        let index = -1
        let userIndex = 0
        const usersFilter = book.users.filter((user)=>{
            index = index+1
            if (user.id === logged_in_user.id){
                userIndex = index
                return true
            }
            return false
        })

        if(usersFilter.length > 0)
        {
            console.log("In")
            likeButton.textContent = 'unlike'
        }
        else{
            console.log("not in")
            likeButton.textContent = 'like'
        }
        book.users.forEach((user)=>{
            const li = document.createElement('li')
            li.textContent = user.username
            list.append(li)
        })

        likeButton.addEventListener('click',()=>{
            if(usersFilter.length > 0){
                book.users.splice(userIndex,1)
                patchRequest(book)
            }
            else{
                book.users.push(logged_in_user)
                patchRequest(book)
            }
        })
        panel.append(thumb,desc,list,likeButton)

    }

    function patchRequest(book){
        fetch(`http://localhost:3000/books/${book.id}`,{
            method:"PATCH",
            headers:{
                "content-type":"application/json"
            },
            body: JSON.stringify(book)
        })
        .then(r=>r.json())
        .then(data=>{
            display(data)
        })
    }

});
