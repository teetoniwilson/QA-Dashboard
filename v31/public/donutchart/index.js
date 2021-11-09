const form = document.querySelector('form');
const name = document.querySelector('#name');
const cost = document.querySelector('#cost');
const error = document.querySelector('#error');

form.addEventListener('submit',(e) => {
    e.preventDefault(); // prevent page from reloading when submitting
    if(name.value && cost.value){
        const item = {
            name: name.value,
            cost: parseInt(cost.value) // convert string to integer
        };

        //save the document to the database
        db.collection('expenses').add(item).then(res =>{
            name.value="";
            cost.value="";
            error.textContent="";
        });


    }else{
        error.textContent = "Please enter a values before submitting";
    }
});