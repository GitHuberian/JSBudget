//bdgetcontroller
var budgetController = (function(){//anonymous function is declared and inmediatly invoqued or called

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){

        if(totalIncome>0){
            this.percentage = Math.round((this.value/totalIncome)*100);
        }else{
            this.percentage = -1;
        }
        
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(current){
            sum +=current.value;
        });
        data.totals[type] = sum;
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
        },
        budget: 0,
        percentage: -1
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
            //console.log(data.allItems[type].length);
            
            //return the element
            return newItem;
        },
        deleteItem: function(type, id){

            var ids, index;
            
            ids= data.allItems[type].map(function(currentValue){
                return currentValue.id;
            });

            index = ids.indexOf(id);
            
            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }

        },
        calculateBudget: function(){
            //calculate total income and expenses
            calculateTotal("exp");
            calculateTotal("inc");

            //calculate the budget income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else{
                data.percentage = -1;
            }
        },
        calculatePercentages: function(){

            data.allItems.exp.forEach(function(currentValue){
                currentValue.calcPercentage(data.totals.inc);
            });
        },
        getPercentage: function(){
            var allPerc = data.allItems.exp.map(function(currentValue){
                return currentValue.getPercentage();
            });
            return allPerc;
        },
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                totalPer: data.percentage
            }
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomesLabel:'.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber= function(num, type){
        var numSplit, int, dec, type;
        //+ or - before a number, exactly 2 decimal points, comma separating the thousands
        
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];
        if(int.length>3){
            int = int.substr(0,int.length-3)+','+int.substr(int.length-3, 3);
        }

        dec = numSplit[1];

        return (type === 'exp'?sign = '-': sign = '+') + ' ' + int + '.' + dec;

    };

    var nodeListForEach = function(list, callback){
        for(var i = 0; i<list.length; i++){
            callback(list[i], i);
        }
    };

    return{
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value, //will be either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        }, 
        addListItem: function(data, type){

            var html, newHtml, element;

            //create HTMLstring with placeholder text
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%">'+
                '<div class="item__description">%description%</div>'+
                '<div class="right clearfix">'+
                    '<div class="item__value">%value%</div>'+
                    '<div class="item__delete">'+
                        '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>'+
                    '</div>'+
                '</div>'+
            '</div>';
            }
            else if(type === 'exp'){
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%">'+
                '<div class="item__description">%description%</div>'+
                '<div class="right clearfix">'+
                    '<div class="item__value">%value%</div>'+
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
            newHtml = newHtml.replace('%value%', formatNumber(data.value, type));

            //instert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        deleteListItem: function(selectorID){

            var el= document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            
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
        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomesLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            if (obj.totalPer > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.totalPer + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
            
        },
        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMStrings.expPercentageLabel);
            
            nodeListForEach(fields, function(currentValue,index){
                if(percentages[index] > 0){
                    currentValue.textContent = percentages[index] + '%';
                }else{
                    currentValue.textContent = '---';
                }
            });
        },
        displayMonth : function(){
            var now, year, month, months;

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            
            now= new Date();
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] +' '+ year;

        },
        changedType: function(){
            var fields = document.querySelectorAll(
                DOMStrings.inputType + ','+
                DOMStrings.inputDescription + ','+
                DOMStrings.inputValue
            );

            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });
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
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtlr.changedType);
    };

    var updateBudget = function(){
        //calculate budget
        budgetCtlr.calculateBudget();

        //return budget
        var budget = budgetCtlr.getBudget();

        //display the budget on the UI
        UICtlr.displayBudget(budget);
        
    };

    var updatePercentages = function(){
        //calculate percentages
        budgetCtlr.calculatePercentages();

        //read percentages fromthe budget controller
        var percentages = budgetCtlr.getPercentage();

        //update the UI with the new percentages
        UICtlr.displayPercentages(percentages);
        
    };

    var ctrlAddItem = function(){
        
        var input, newItem;

        //Get the field input data
        input = UICtlr.getInput();

        if( input.description.trim()!=="" && !isNaN(input.value) && input.value > 0){
            //add item to the budget controller
            newItem = budgetCtlr.addItem(input.type, input.description, input.value);

            //add the item to the user interface
            UICtlr.addListItem(newItem, input.type);

            //clear the fields
            UICtlr.clearFields();

            //calculate the budget
            updateBudget();

            //calculate and update percentages
            updatePercentages();
        }
    }

    var ctrlDeleteItem = function(event){

        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            splitID = itemID.split("-");
            type= splitID[0];
            ID = parseInt(splitID[1]);
            console.log(ID);
            
            //delete the item from the data structure
            budgetCtlr.deleteItem(type, ID);

            //delete the item from the UI
            UICtlr.deleteListItem(itemID);

            //update and show the new budget
            updateBudget();
        }

    };

    return {
        init: function(){
            console.log('app started');
            //reset the budget on the UI
            UICtlr.displayMonth();
            UICtlr.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                totalPer: 0
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();