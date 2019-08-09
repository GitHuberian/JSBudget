//bdgetcontroller
var budgetController = (function(){//anonymous function is declared and inmediatly invoqued or called

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //store data: incomes, expenses and totals
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals:{
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function(type, des, val){

            var newItem, ID;
            //create new id
            if(data.allItems[type].length > 0 ){
                ID=data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else{
                ID = 0 ;
            }

            //create new item based on 'inc' or 'exp' type
            if(type==='exp'){
                newItem = new Expense(ID, des, val);
            }
            else if(type==='inc'){
                newItem = new Income(ID, des, val);
            }
            
            //push it into the data structure
            data.allItems[type].push(newItem);//add the item to end of the inc/exp array
            console.log(data.allItems[type].length);
            
            //return the element
            return newItem;
        },
        //testing function
        testing: function(){
            // var output = '';
            // for (var property in data) {
            // output += property + ': ' + data[property]+'; ';
            // }
            // console.log(output);
            console.log(Object.values(data));
        }
    };

})();

//uicontroller
var UIController = (function(){

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };

    return{
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value, //will be either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        }, 

        addListItem: function(data, type){

            var html, newHtml, element;

            //create HTMLstring with placeholder text
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%">'+
                '<div class="item__description">%description%</div>'+
                '<div class="right clearfix">'+
                    '<div class="item__value">+ %value%</div>'+
                    '<div class="item__delete">'+
                        '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>'+
                    '</div>'+
                '</div>'+
            '</div>';
            }
            else if(type === 'exp'){
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%">'+
                '<div class="item__description">%description%</div>'+
                '<div class="right clearfix">'+
                    '<div class="item__value">- %value%</div>'+
                    '<div class="item__percentage">21%</div>'+
                    '<div class="item__delete">'+
                        '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>'+
                    '</div>'+
                '</div>'+
            '</div>';
            }

            //replacing placeholders with actual data
            newHtml = html.replace('%id%', data.id);
            newHtml = newHtml.replace('%description%', data.description);
            newHtml = newHtml.replace('%value%', data.value);
            

            //instert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        clearFields: function(){
            
            var fields;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ', '+ DOMStrings.inputValue);

            var fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(current, index, array){
                current.value = "";
            });
            fieldsArray[0].focus();
        },

        getDOMStrings: function(){
            return DOMStrings;
        }
    };

})();


//global appcontroller
var controller = (function(budgetCtlr, UICtlr){

    var DOM = UICtlr.getDOMStrings();

    var setupEventListeners = function(){
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);//callback

        document.addEventListener('keypress', function(event){
            if(event.keyCode===13 || event.which===13){
                ctrlAddItem();
            }
        });
    };

    var ctrlAddItem = function(){
        
        var input, newItem;

        //Get the field input data
        input = UICtlr.getInput();

        //add item to the budget controller
        newItem = budgetCtlr.addItem(input.type, input.description, input.value);

        //add the item to the user interface
        UICtlr.addListItem(newItem, input.type);

        //clear the fields
        UICtlr.clearFields();

        //calculate the budget

        //display the budget
    }

    return {
        init: function(){
            console.log('app started');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();