
//Items are stored in itemBasketonary. Format is {str itemName : array [itemPrice , itemAmount]}
var itemBasket;
getItems();

function getItems()
	{    
		if (window.XMLHttpRequest)
		  {// code for IE7+, Firefox, Chrome, Opera, Safari
		  xmlhttp=new XMLHttpRequest();
		  }
		else
		  {// code for IE6, IE5
		  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		  }
		xmlhttp.onreadystatechange=function()
		  {
		  if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
            if (xmlhttp.responseText == "EMPTY")
                {
                //document.getElementById("txtHint").innerHTML="No classroom named in database.";
                }
            else
                {
                //document.getElementById("txtHint").innerHTML=xmlhttp.responseText;
                itemBasket = JSON.parse(xmlhttp.responseText);
                createRows(itemBasket);
                }
            }
		  }
		xmlhttp.open("GET","getItems.php",true);
		xmlhttp.send();
}

function createCollapse() {
  //Initially hide all the expandable content with class name "content" 
  $(".collapseData").hide();
  
  //Toggle the component when parent class "heading" is clicked on 
  $(".collapse").click(function() {
    
    var header = $(this);
    
    //Toggle the arrow image based on whether the content <p> is expanded or not
    header.children('#arrow').toggleClass('plus_sign minus_sign');
    
    //Expand or collapse the content <p> with slide mode animation 
    header.next(".collapseData").slideToggle(500);
  });
}

function expandCollapseAll(objButton) {

    $(".collapseData").slideToggle();
    $(".arrow").toggleClass('plus_sign minus_sign');
    
    if (objButton.value == "Avaa kaikki") {
        objButton.value = "Sulje kaikki";
    } else {
        objButton.value = "Avaa kaikki";
    }

}

function createRows(itemBasket) {

    var itemNames = Object.keys(itemBasket);
/*
    for (var i=0; i < itemNames.length; i=i+4) {
        $("#content").append('<div class="box" style="outline:#333333 dotted medium;" id="'+itemNames[i]+'"></div><div class="box" id='+itemNames[i+1]+'></div><div class="box" style="outline:#333333 dotted medium;" id="'+itemNames[i+2]+'"></div><div class="box" id="'+itemNames[i+3]+'"></div>');   //co1 is middle and col2 is left 
    }*/
    
    //Create holders of each item
    for ( var i = 0; i < itemNames.length; i++) {
    
        if ($('#'+itemBasket[itemNames[i]][2]+'').length == 0) {
           
            $("#content").append('<div class="collapse"><div id="arrow" class="arrow plus_sign"></div><h1>'+capFirstLetter(itemBasket[itemNames[i]][2])+'</h1></div><div id="'+itemBasket[itemNames[i]][2]+'" class="collapseData"></div>');
            
        }
        $('#'+itemBasket[itemNames[i]][2]+'').append('<div class="box" id="'+itemNames[i]+'"></div>');

        /*
        if (i%2 != 0) {
                $("#kategoria").append('<div class="box" style="outline:#86B32D dotted medium;" id="'+itemNames[i]+'"></div>');
        } else {
               $("#kategoria").append('<div class="box" id="'+itemNames[i]+'"></div>');
        }   //content ja append
        */
    }
    
    createItemDiv();
}

/*function createRows(itemBasket) {

    var itemNames = Object.keys(itemBasket);

    for (var i=0; i < itemNames.length; i=i+3) {
        $("#content").append('<div class="rowHandler"><div class="colmid"><div class="colleft"><div class="col1" id="'+itemNames[i+1]+'"></div><div class="col2" id='+itemNames[i]+'></div><div class="col3" id="'+itemNames[i+2]+'"></div></div></div></div>');   //co1 is middle and col2 is left 
    }
    createItemDiv();
}*/

function removeUmlaut(str) {
    str = str.replace(/[ä]/g, 'a');
    str = str.replace(/[Ä]/g, 'A');
    str = str.replace(/[Ö]/g, 'O');
    str = str.replace(/[ö]/g, 'o');
    return str;
}

function createItemDiv() {
    
    for (key in itemBasket) { 
        $('#'+key+'').append('<div style="min-height:150px"><img src="img/'+removeUmlaut(key)+'.jpg" alt="Ei kuvaa"  style="width:200px;max-height:150px" ></img></div><div style="float:bottom;min-height:54px;word-wrap:break-word;"><b>'+capFirstLetter(key)+' '+itemBasket[key][0]+' e/kpl'+'</b><br><input id="'+key+'" style="font-size:18pt; width:50pt" maxlength="4"  type="number" onchange="changeAmount('+key+')" value="0"></div>')
    }
    
    createCollapse();
    /*for (key in itemBasket) { 
        $('#'+key+'').append('<div><img src="img/'+key+'.jpg" height="50"></img>'+capFirstLetter(key)+' '+itemBasket[key][0]+' e/kpl'+'<input style="font-size:18pt" type="button" name="decrease" value="-" onclick="decreaseAmount('+key+')" /> <input id="'+key+'" style="font-size:18pt; width:50pt" maxlength="4"  type="number" onchange="changeAmount('+key+')" value="0"> <input  style="font-size:18pt" type="button" name="increase" value="+" onclick="increaseAmount('+key+')" /> </div>')
    }*/
}

function decreaseAmount(object) {
    if (object[1].value == 0) {
        return;
    }
    object[1].value--;
    changeAmount(object);
}

function increaseAmount(object) {
    object[1].value++;
    changeAmount(object);
}

function changeAmount(object) {
    
    object = object[1]; 
    
    if (parseInt(object.value) == itemBasket[object.id][1]) {
        return;
    } else if (object.value < 0 || object.value == "") {
        //If field is set to below zero, empty or NaN (not a number), change amount of items to zero and calculate price
        var change = -1*itemBasket[object.id][0]*parseInt(itemBasket[object.id][1]);
        updatePrice(change);
        itemBasket[object.id][1] = 0;
        object.value = 0;       
    }
    else {
        //calculate the price change. itemPrice * ( newItemAmount - oldItemAmount)
        var change = itemBasket[object.id][0]*(parseInt(object.value) - itemBasket[object.id][1]);
        updatePrice(change);
        itemBasket[object.id][1] = parseInt(object.value);
    }    
}

function updatePrice(difference) {
    document.getElementById("price").innerHTML = (parseFloat(document.getElementById("price").innerHTML) + difference).toFixed(2); //Round up to two decimals
}

function capFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
