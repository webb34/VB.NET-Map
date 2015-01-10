// ID of div that is to contain all of the map
var addToDiv = "schematic";
window.onload = function () {
    var div = document.createElement("div");
    document.body.appendChild(div);
    div.setAttribute("id", addToDiv);
    var roomSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    div.appendChild(roomSVG);
    roomSVG.setAttribute("preserveAspectRatio","xMinYMin");
    roomSVG.setAttribute("id", "roomSVG");

    //handle the walls first
    var wallsXMLDoc = loadXMLDoc("walls.xml");
    var walls = wallsXMLDoc.getElementsByTagName("wall");
    for(i = 0; i < walls.length; i++){
        //get base values
        atts = walls[i].attributes;
        atts.getNamedItem("objectID")!=null?objectID=atts.getNamedItem("objectID").value:alert("Error: Attempted to load filing cabinet with no type at: "+ i);
        objectClass = atts.getNamedItem("objectClass")!=null?atts.getNamedItem("objectClass").value:null;
        orientation = atts.getNamedItem("orientation")!=null?atts.getNamedItem("orientation").value:0;
        x = atts.getNamedItem("x")!=null?parseFloat(atts.getNamedItem("x").value):0;
        y = atts.getNamedItem("y")!=null?parseFloat(atts.getNamedItem("y").value):0;
        style = atts.getNamedItem("style")!=null?atts.getNamedItem("style").value:null;
        //compile the coorStrs
        coorStr="";
        var coorStrs = walls[i].getElementsByTagName("coorStr");
        for(j = 0; j < coorStrs.length; j++){
            coorStr += coorStrs[j].childNodes[0].nodeValue;
        }
        if(coorStr.length>0){
            addWall(objectID,objectClass,orientation,x,y,coorStr);
        } else {
            console.log("empty wall coorStr for "+i);
        }
    }

    //handle the filing cabinets next
    var filingCabinetsXMLDoc = loadXMLDoc("filingCabinets.xml");
    var filingCabinets = filingCabinetsXMLDoc.getElementsByTagName("filingCabinet");
    for(i = 0; i < filingCabinets.length; i++){
        //get base values
        atts = filingCabinets[i].attributes;
        atts.getNamedItem("objectID")!=null?objectID=atts.getNamedItem("objectID").value:alert("Error: Attempted to load filing cabinet with no type at: "+ i);
        x = atts.getNamedItem("x")!=null?parseFloat(atts.getNamedItem("x").value):null;
        y = atts.getNamedItem("y")!=null?parseFloat(atts.getNamedItem("y").value):null;
        width = atts.getNamedItem("width")!=null?parseFloat(atts.getNamedItem("width").value):null;
        height = atts.getNamedItem("height")!=null?parseFloat(atts.getNamedItem("height").value):null;
        rows = atts.getNamedItem("rows")!=null?parseFloat(atts.getNamedItem("rows").value):null;
        columns = atts.getNamedItem("columns")!=null?parseFloat(atts.getNamedItem("columns").value):null;
        orientation = atts.getNamedItem("orientation")!=null?parseFloat(atts.getNamedItem("orientation").value):null;
        addFilingCabinet(objectID,x,y,width,height,rows,columns,orientation);
    }

    //handle the furniture next
    var furnitureXMLDoc = loadXMLDoc("furnitures.xml");
    var furnitures = furnitureXMLDoc.getElementsByTagName("furniture");
    for(i = 0; i < furnitures.length; i++){
        //get base values
        atts = furnitures[i].attributes;
        atts.getNamedItem("objectID")!=null?objectID=atts.getNamedItem("objectID").value:alert("Error: Attempted to load furniture with no type at: "+ i);
        orientation = atts.getNamedItem("orientation")!=null?parseFloat(atts.getNamedItem("orientation").value):null;
        x = atts.getNamedItem("x")!=null?parseFloat(atts.getNamedItem("x").value):null;
        y = atts.getNamedItem("y")!=null?parseFloat(atts.getNamedItem("y").value):null;
        //compile the coorStrs
        coorStr="";
        var coorStrs = furnitures[i].getElementsByTagName("coorStr");
        for(j = 0; j < coorStrs.length; j++){
            coorStr += coorStrs[j].childNodes[0].nodeValue;
        }
        if(coorStr.length>0){
            addFurniture(objectID,coorStr,x,y,orientation);
        } else {
            console.log("empty furniture coorStr for "+i);
        }
    }


    //handle the rooms next
    var roomsXMLDoc = loadXMLDoc("rooms.xml");
    var rooms = roomsXMLDoc.getElementsByTagName("room");
    var labels = [];// will hold the labels for every room until everything is made. Then it will be used to label each room ussing associative arrays. This avoids labels being cut off by other elements.
    for(i = 0; i < rooms.length; i++){
        atts = rooms[i].attributes;
        //get base values
        atts.getNamedItem("type")!=null?type=atts.getNamedItem("type").value:alert("Error: Attempted to load room with no type at: "+ i);
        atts.getNamedItem("objectID")!=null?objectID=atts.getNamedItem("objectID").value:alert("Error: Attempted to load room with no ID at: "+ i);

        objectClass = atts.getNamedItem("objectClass")!=null?atts.getNamedItem("objectClass").value:null;
        orientation = atts.getNamedItem("orientation")!=null?atts.getNamedItem("orientation").value:0;
        x = atts.getNamedItem("x")!=null?parseFloat(atts.getNamedItem("x").value):0;
        y = atts.getNamedItem("y")!=null?parseFloat(atts.getNamedItem("y").value):0;
        width = atts.getNamedItem("width")!=null?parseFloat(atts.getNamedItem("width").value):null;
        height = atts.getNamedItem("height")!=null?parseFloat(atts.getNamedItem("height").value):null;
        style = atts.getNamedItem("style")!=null?atts.getNamedItem("style").value:null;
        textX = atts.getNamedItem("textX")!=null?parseFloat(atts.getNamedItem("textX").value):null;
        textY = atts.getNamedItem("textY")!=null?parseFloat(atts.getNamedItem("textY").value):null;
        textWidth = atts.getNamedItem("textWidth")!=null?parseFloat(atts.getNamedItem("textWidth").value):null;
        display = atts.getNamedItem("display")!=null?false:null;
        coorStr="";
        var coorStrs = rooms[i].getElementsByTagName("coorStr");
        for(j = 0; j < coorStrs.length; j++){
            coorStr += coorStrs[j].childNodes[0].nodeValue;
        }
        coorStr=(type!="1" && type != "2" && coorStr.length>0)?coorStr:null;
        var infoSets = rooms[i].getElementsByTagName("infoSet");
        var infoSetsArry = new Array();
        for(j = 0; j < infoSets.length; j++){
            var infoSet = new Object();
            infoSet.displayName = infoSets[j].getElementsByTagName("name")[0].attributes.getNamedItem("displayName")!==null?infoSets[j].getElementsByTagName("name")[0].attributes.getNamedItem("displayName").value:null;
            infoSet.fullName = infoSets[j].getElementsByTagName("name")[0].childNodes[0]!==undefined?infoSets[j].getElementsByTagName("name")[0].childNodes[0].nodeValue:null;
            infoSet.photoLoc = infoSets[j].getElementsByTagName("photoLoc")[0]!==undefined?infoSets[j].getElementsByTagName("photoLoc")[0].childNodes[0].nodeValue:null;
            infoSet.pcName = infoSets[j].getElementsByTagName("pcName")[0]!==undefined?infoSets[j].getElementsByTagName("pcName")[0].childNodes[0].nodeValue:null;
            infoSet.phoneNum = infoSets[j].getElementsByTagName("phoneNum")[0]!==undefined?infoSets[j].getElementsByTagName("phoneNum")[0].childNodes[0].nodeValue:null;
            infoSet.ipAddress = infoSets[j].getElementsByTagName("ipAddress")[0]!==undefined?infoSets[j].getElementsByTagName("ipAddress")[0].childNodes[0].nodeValue:null;
            infoSet.wallPlateNum = infoSets[j].getElementsByTagName("wallPlateNum")[0]!==undefined?infoSets[j].getElementsByTagName("wallPlateNum")[0].childNodes[0].nodeValue:null;
            infoSetsArry.push(infoSet);
        }
        var labelTemp = addRoom(type,objectID,objectClass,orientation,x,y,width,height,coorStr,style,textX,textY,textWidth,infoSetsArry,display);
        for(j=0;j<labelTemp.length;j++){
            labels.push(labelTemp[j]);
        }   
    }
    

    //handle the printers next
    var printersXMLDoc = loadXMLDoc("printers.xml");
    var printers = printersXMLDoc.getElementsByTagName("printer");
    for(i = 0; i < printers.length; i++){
        atts = printers[i].attributes;
        //get base values
        (atts.getNamedItem("objectID")!==null && atts.getNamedItem("objectID")!==undefined && atts.getNamedItem("objectID")!=="")?objectID=atts.getNamedItem("objectID").value:alert("Error: Attempted to load room with no ID at: "+ i);
        
        x = (atts.getNamedItem("x")!==null && atts.getNamedItem("x")!==undefined && atts.getNamedItem("x")!=="")?parseFloat(atts.getNamedItem("x").value):0;
        y = (atts.getNamedItem("y")!==null && atts.getNamedItem("y")!==undefined && atts.getNamedItem("y")!=="")?parseFloat(atts.getNamedItem("y").value):0;
        var infoSet = new Object();
        infoSet.fullName = (atts.getNamedItem("fullName")!==null && atts.getNamedItem("fullName")!==undefined && atts.getNamedItem("fullName")!=="")?atts.getNamedItem("fullName").value:null;
        infoSet.model = (atts.getNamedItem("model")!==null && atts.getNamedItem("model")!==undefined && atts.getNamedItem("model")!=="")?atts.getNamedItem("model").value:null;
        infoSet.ipAddress = (atts.getNamedItem("ipAddress")!==null && atts.getNamedItem("ipAddress")!==undefined && atts.getNamedItem("ipAddress")!=="")?atts.getNamedItem("ipAddress").value:null;
        infoSet.wallPlateNum = (atts.getNamedItem("wallPlateNum")!==null && atts.getNamedItem("wallPlateNum")!==undefined && atts.getNamedItem("wallPlateNum")!=="")?atts.getNamedItem("wallPlateNum").value:null;
        infoSet.faxWallPlateNum = (atts.getNamedItem("faxWallPlateNum")!==null && atts.getNamedItem("faxWallPlateNum")!==undefined && atts.getNamedItem("faxWallPlateNum")!=="")?atts.getNamedItem("faxWallPlateNum").value:null;
        addPrinter(objectID,x,y,infoSet);

    }

    //handle the support beams last sot hey are on top of everything else(except the labels and zones)
    var supportBeamsXMLDoc = loadXMLDoc("supportBeams.xml");
    var supportBeams = supportBeamsXMLDoc.getElementsByTagName("supportBeam");
    for(i = 0; i < supportBeams.length; i++){
        atts = supportBeams[i].attributes;
        //get base values
        atts.getNamedItem("objectID")!=null?objectID=atts.getNamedItem("objectID").value:alert("Error: Attempted to load supportBeam with no ID at: "+ i);
        orientation = atts.getNamedItem("orientation")!=null?atts.getNamedItem("orientation").value:0;
        x = atts.getNamedItem("x")!=null?parseFloat(atts.getNamedItem("x").value):0;
        y = atts.getNamedItem("y")!=null?parseFloat(atts.getNamedItem("y").value):0;
        width = atts.getNamedItem("width")!=null?parseFloat(atts.getNamedItem("width").value):10;
        height = atts.getNamedItem("height")!=null?parseFloat(atts.getNamedItem("height").value):10;
        addSupportBeam(objectID,orientation,x,y,width,height);
    }

    //add the labels for each room last so they are on top of everything else(except the zones)
    for(i=0;i<labels.length;i++){
        addLabel(labels[i]);
    }

    // move the U-floorG to the front
    var uFloorG = roomSVG.removeChild(document.getElementById("U-floorG"));
    roomSVG.appendChild(uFloorG);

    //add last modified date
    //addLabelText(roomSVG,"Effective<br>"+document.lastModified.split(' ')[0],"1111","800");
};
function whichFloor(idString, baseClass){
    if(baseClass === null){
        baseClass = "undefined";
    }
    var reg = /(\d*)-/;
    var curFloor = reg.exec(idString);
    if(curFloor !== null && curFloor[1].length !== 0){
        var floorCode = curFloor[1];
    } else{
        var floorCode = "U";
    }
    if(document.getElementById(floorCode+"-floorG") !== null){
        var floorG = document.getElementById(floorCode+"-floorG");
    } else if(document.getElementById(floorCode+"-floorG") === null){
        var floorG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        floorG.setAttribute("id", floorCode+"-floorG");
        floorG.setAttribute("class", "floorG");
        roomSVG.appendChild(floorG);
    }
    if(document.getElementById(floorCode+"-"+baseClass+"G") !== null){
        var toG = document.getElementById(floorCode+"-"+baseClass+"G");
    } else{
        var toG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        toG.setAttribute("id", floorCode+"-"+baseClass+"G");
        toG.setAttribute("class", "holder");
        floorG.appendChild(toG);
    }

    return toG;
}

function loadXMLDoc(dname)
{
    xhttp = (window.XMLHttpRequest)?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");
    xhttp.open("GET",dname,false);
    xhttp.send();
    return xhttp.responseXML;
}

function transp(event){
    if(event.which == "116"){
        var allPaths = document.getElementsByTagName("path");
        for(p=0;p<allPaths.length;p++){
            if(allPaths[p].getAttribute("class") != null && allPaths[p].getAttribute("class").indexOf(" transparent") == -1){
                allPaths[p].setAttribute("class",allPaths[p].getAttribute("class")+" transparent");
            } else if(allPaths[p].getAttribute("class") == null){
                allPaths[p].setAttribute("class"," transparent");
            } else if(allPaths[p].getAttribute("class") != null && allPaths[p].getAttribute("class").indexOf(" transparent") != 0){
                allPaths[p].setAttribute("class",allPaths[p].getAttribute("class").replace(" transparent",""));
            } else if(allPaths[p].getAttribute("class") != null && allPaths[p].getAttribute("class").indexOf(" transparent") == 0){
                allPaths[p].removeAttribute("class");
            }
        }
        document.getElementById("outline").style.opacity=document.getElementById("outline").style.opacity=='0'?'1':'0';
    }
}

function checkEnter(event){
    if(event.which == "13"){
        search();
    }
}

// searches the page for requested content.
function search() {
    clearSearch();
    var results = document.getElementById("results");
    results.innerHTML="";
    results.removeAttribute("style");
    var option = document.getElementById("searchBar").getElementsByTagName("select")[0].value;
    var query = document.getElementById("searchBar").getElementsByTagName("input")[0].value;
    var potential=[];
    var roomSVG = document.getElementById("roomSVG");
    var allElements = roomSVG.getElementsByTagName("*");
    var test=[];
    var allText=[];
    var re = new RegExp(query,"i");
    for(i=0;i<allElements.length;i++){
        if(allElements[i].getAttribute(option)!=null){
            if(allElements[i].getAttribute(option).search(re)!=-1){
                var found = allElements[i];
                while(found.tagName.toUpperCase()!=="G"){
                    found=found.parentNode;
                }
                potential.push(found);
            }
        }
    }
    if(potential.length === 0){
        results.style.color="red";
        results.innerHTML="No results found";
    }else{
        results.style.color="black";
        results.innerHTML="Result(s) found: "+potential.length;
        lookAtMe(potential);
    }
}

//clears search
function clearSearch(){
    while (document.getElementsByClassName("clone")[0] !== undefined) {
        document.getElementsByClassName("clone")[0].parentNode.removeChild(document.getElementsByClassName("clone")[0]);
    }
    while (document.getElementsByClassName("roomInfo")[0] !== undefined) {
        document.getElementsByClassName("roomInfo")[0].parentNode.removeChild(document.getElementsByClassName("roomInfo")[0]);
    }
}
// causes elements in passed array to catch the users attention(animate, change color, pulse, etc)
function lookAtMe(potential){
    var clones=[];
    for(m=0;m<potential.length;m++){
        var pathDOM = "";
        var rectDOM = "";
        var textDOM = "";
        clones.push(potential[m].cloneNode(true));
        //look thorugh every child within g. if it's the path, remove it, but store it temporarily
        for(i=clones[m].children.length-1; i>=0;i--){
            if(clones[m].children[i].tagName.toUpperCase()=="PATH"){
                pathDOM = clones[m].children[i].cloneNode(true);
            }
            if(clones[m].children[i].tagName.toUpperCase()=="RECT"){
                rectDOM = clones[m].children[i].cloneNode(true);
            }
            if(clones[m].children[i].tagName.toUpperCase()=="TEXT"){
                textDOM = clones[m].children[i].cloneNode(true);
            }
        }
        // reformat the clone so that there is one g for each effect(G(translate)->G(scale)->G(opacity)->path)
        var topG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        topG.setAttribute("class",potential[m].getAttribute("class") + " clone");//set the top g to be the class "clone" so when searching for them later, it becomes easy to remove them.
        var path = pathDOM.getAttribute("d");
        var match = /[^\s]+(M)/;
        path = path.replace(match, "L");
        path+=" Z";
        pathDOM.setAttribute("d",path);
        var secondG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        secondG.setAttribute("class","cloneScaleAnim");
        var thirdG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        thirdG.setAttribute("class","cloneOpacityAnim");
        thirdG.appendChild(pathDOM);
        if(rectDOM!==""){thirdG.appendChild(rectDOM);}
        if(textDOM!==""){thirdG.appendChild(textDOM);}
        secondG.appendChild(thirdG);
        topG.appendChild(secondG);
        var transform = potential[m].getAttribute("transform");
        var firstClone = topG;
        //clone them
        var secondClone = firstClone.cloneNode(true);
        var thirdClone = firstClone.cloneNode(true);
        document.getElementById("roomSVG").appendChild(firstClone);
        document.getElementById("roomSVG").appendChild(secondClone);
        document.getElementById("roomSVG").appendChild(thirdClone);
        firstClone.setAttribute("transform",transform);
        secondClone.setAttribute("transform",transform);
        thirdClone.setAttribute("transform",transform);
    }
}

function displayInfo(event){
    clearSearch();
    var clicked=event.target;
    //find classname 
    while(clicked.tagName.toUpperCase()!=="G"){
        clicked=clicked.parentNode;
    }
    //start making info div
    var infoG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    infoG.setAttribute("class","roomInfo");
    document.getElementById("roomSVG").appendChild(infoG);
    var infoRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    infoRect.setAttribute("width", 200);
    infoRect.setAttribute("height", 1);
    infoRect.setAttribute("x", 0);
    infoRect.setAttribute("y", 0);
    infoG.appendChild(infoRect);
    var infoWidth = infoRect.getBBox().width;
    var nameG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    infoG.appendChild(nameG);
    nameG.setAttribute("class","name");
    //create the background rect for the name
    var nameRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    nameG.appendChild(nameRect);
    nameRect.setAttribute("width", infoWidth);
    nameRect.setAttribute("height", 40);
    nameRect.setAttribute("x", 0);
    nameRect.setAttribute("y", 0);
    
    //create the name text
    var nameText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    if(clicked.getAttribute("fullName") !== null){
        nameText.textContent = clicked.getAttribute("fullName");
    } else if(clicked.getAttribute("fullName") === null && clicked.getAttribute("class").indexOf("printer") != -1){
        nameText.textContent = "Local Printer";
    }
    nameG.appendChild(nameText);
    nameText.setAttribute("transform","translate(10,10)");
    

    //check for a phone number. If there is one, add it, and it's extension(last three digits)
    if(clicked.getAttribute("phoneNum") !== null){
        var g =  document.createElementNS("http://www.w3.org/2000/svg", "g");
        infoG.appendChild(g);
        g.setAttribute("class","phoneNum");
        var gY = parseFloat(infoG.getBoundingClientRect().height) + 10;
        g.setAttribute("transform","translate(10,"+gY+")");
        var title = document.createElementNS("http://www.w3.org/2000/svg", "text");
        title.setAttribute("class","infoTitle");
        title.textContent = "Phone Number:";
        g.appendChild(title);
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.textContent = clicked.getAttribute("phoneNum");
        var gHeight = parseFloat(g.getBBox().height);
        text.setAttribute("transform","translate(0,"+(gHeight+5)+")");
        g.appendChild(text);
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.textContent = "(ext. "+ clicked.getAttribute("phoneNum").substr(clicked.getAttribute("phoneNum").length-3) +")";
        var gHeight = parseFloat(g.getBBox().height);
        text.setAttribute("transform","translate(0,"+(gHeight+5)+")");
        g.appendChild(text);
    }

    //add the ID
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    infoG.appendChild(g);
    g.setAttribute("class","unitID");
    var gY = parseFloat(infoG.getBoundingClientRect().height) + 10;
    g.setAttribute("transform","translate(10,"+gY+")");
    var title = document.createElementNS("http://www.w3.org/2000/svg", "text");
    title.setAttribute("class","infoTitle");
    title.textContent = "ID:";
    g.appendChild(title);
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    var gHeight = parseFloat(g.getBBox().height);
    text.setAttribute("transform","translate(0,"+(gHeight+5)+")");
    text.textContent = clicked.getAttribute("id");
    g.appendChild(text);

    //check for a pc name
    if(clicked.getAttribute("pcName") !== null){
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        infoG.appendChild(g);
        g.setAttribute("class","pcName");
        var gY = parseFloat(infoG.getBoundingClientRect().height) + 10;
        g.setAttribute("transform","translate(10,"+gY+")");
        var title = document.createElementNS("http://www.w3.org/2000/svg", "text");
        g.appendChild(title);
        title.setAttribute("class","infoTitle");
        title.textContent = "PC Name:";
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        var gHeight = parseFloat(g.getBBox().height);
        text.setAttribute("transform","translate(0,"+(gHeight+5)+")");
        g.appendChild(text);
        text.textContent = clicked.getAttribute("pcName");
    }

    //check for a model
    if(clicked.getAttribute("model") !== null){
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        infoG.appendChild(g);
        g.setAttribute("class","printerModel");
        var gY = parseFloat(infoG.getBoundingClientRect().height) + 10;
        g.setAttribute("transform","translate(10,"+gY+")");
        var title = document.createElementNS("http://www.w3.org/2000/svg", "text");
        title.setAttribute("class","infoTitle");
        title.textContent = "Model:";
        g.appendChild(title);
        var text = wordWrapper(g, (infoWidth-10), clicked.getAttribute("model"), 5, "start")
        var gHeight = parseFloat(g.getBBox().height);
        text.setAttribute("transform","translate(0,"+(gHeight+5)+")");
        g.appendChild(text);
    }

    //check for IP Address
    if(clicked.getAttribute("ipAddress") !== null){
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        infoG.appendChild(g);
        g.setAttribute("class","ipAddress");
        var gY = parseFloat(infoG.getBoundingClientRect().height) + 10;
        g.setAttribute("transform","translate(10,"+gY+")");
        var title = document.createElementNS("http://www.w3.org/2000/svg", "text");
        title.setAttribute("class","infoTitle");
        title.textContent = "IP Address:";
        g.appendChild(title);
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        var gHeight = parseFloat(g.getBBox().height);
        text.setAttribute("transform","translate(0,"+(gHeight+5)+")");
        text.textContent = clicked.getAttribute("ipAddress");
        g.appendChild(text);
    }

    //check for wall plate num
    if(clicked.getAttribute("wallPlateNum") !== null){
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        infoG.appendChild(g);
        g.setAttribute("class","wallPlateNum");
        var gY = parseFloat(infoG.getBoundingClientRect().height) + 10;
        g.setAttribute("transform","translate(10,"+gY+")");
        var title = document.createElementNS("http://www.w3.org/2000/svg", "text");
        title.setAttribute("class","infoTitle");
        title.textContent = "Wall Plater Num:";
        g.appendChild(title);
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        var gHeight = parseFloat(g.getBBox().height);
        text.setAttribute("transform","translate(0,"+(gHeight+5)+")");
        text.textContent = clicked.getAttribute("wallPlateNum");
        g.appendChild(text);
    }

    //check for fax wall plate num
    if(clicked.getAttribute("faxWallPlateNum") !== null){
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        infoG.appendChild(g);
        g.setAttribute("class","faxWallPlateNum");
        var gY = parseFloat(infoG.getBoundingClientRect().height) + 10;
        g.setAttribute("transform","translate(10,"+gY+")");
        var title = document.createElementNS("http://www.w3.org/2000/svg", "text");
        title.setAttribute("class","infoTitle");
        title.textContent = "Fax Wall Plater Num:";
        g.appendChild(title);
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        var gHeight = parseFloat(g.getBBox().height);
        text.setAttribute("transform","translate(0,"+(gHeight+5)+")");
        text.textContent = clicked.getAttribute("faxWallPlateNum");
        g.appendChild(text);
    }

    //check for a status
    if(clicked.getAttribute("status") !== null){
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        infoG.appendChild(g);
        g.setAttribute("class","status");
        var gY = parseFloat(infoG.getBoundingClientRect().height) + 10;
        g.setAttribute("transform","translate(10,"+gY+")");
        var title = document.createElementNS("http://www.w3.org/2000/svg", "text");
        title.setAttribute("class","infoTitle");
        title.textContent = "Status:";
        g.appendChild(title);
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        var gHeight = parseFloat(g.getBBox().height);
        text.setAttribute("transform","translate(0,"+(gHeight+5)+")");
        text.textContent = clicked.getAttribute("status");
        g.appendChild(text);
    }

    //check for photo if not a printer. If not a printer, and no photo, add the default question mark.
    //needs to be near the end so it does not skew the infoG's height before the other elements are added.
    if(clicked.getAttribute("class").indexOf("printer") == -1){
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", "displayPhoto");
        if(clicked.getAttribute("photoLoc") !== undefined && clicked.getAttribute("photoLoc") !== null && clicked.getAttribute("photoLoc") !== ""){
            var photoImage = document.createElementNS("http://www.w3.org/2000/svg", "image");
            photoImage.setAttribute("xlink:href", photoSrc);
        } else {
            var photoImage = document.createElementNS("http://www.w3.org/2000/svg", "path");
            photoImage.setAttribute("d","M 16,71 L 26,71 L 26,81 L 16,81 Z M 16,61 L 16,46 L 26,46 L 26,61 Z M 16,41 L 26,41 A 15,15 0 1,0 11,26 L 1,26 A 25,25 0 1,1 26,51 L 16,51 Z");
        }
        g.appendChild(photoImage);
        infoG.appendChild(g);
        var pWidth = parseFloat(g.getBoundingClientRect().width);
        var pY = parseFloat(nameG.getBoundingClientRect().height) + 10;
        g.setAttribute("transform","translate("+parseFloat(infoWidth-pWidth-5)+","+pY+")");
    }

    //add the close button
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class","close");
    var closePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    closePath.setAttribute("d","M 1,1 L 1,21 L 21,21 L 21,1 Z M 6,6 L 16,16 M 16,6 L 6,16");
    g.appendChild(closePath);
    infoG.appendChild(g);
    g.addEventListener('click', clearSearch, false);
    var gWidth = g.getBBox().width;
    var strokeWidth = getStrokeWidth(closePath);
    g.setAttribute("transform","translate("+(infoWidth-(gWidth+strokeWidth))+")");
    //adjust the infoRect to accomodate the new pieces of informations
    infoRect.setAttribute("height",infoG.getBBox().height+10);
    //properly position the roomInfo g
    var left = clicked.getBoundingClientRect().left+window.scrollX;
    var x = left;
    var boxHeight = infoG.getBBox().height;
    var svgHeight = document.getElementById("roomSVG").getBoundingClientRect().height;
    var top = clicked.getBoundingClientRect().top+window.scrollY;
    var height = clicked.getBoundingClientRect().height;
    if(top+height+boxHeight <= svgHeight){
        var y=top+height;
    } else {
        var y=top-boxHeight;
    }

    infoG.setAttribute("transform","translate("+x+","+y+")");
}

function getStrokeWidth(element){
    var win = document.defaultView || window, style;
    var pathStyles = win.getComputedStyle(element);
    var strokeWidth = parseFloat(pathStyles["stroke-width"]) || parseFloat(pathStyles["strokeWidth"]);
    return strokeWidth;
}

function updatePrinterStatus(container, success){
    var path = container.getElementsByTagName("path")[0];
    if(success == "pending"){
        if(container.getAttribute("class").indexOf("offline") === -1 && container.getAttribute("class").indexOf("online") === -1){
            container.setAttribute("class",container.getAttribute("class")===null?"pending":container.getAttribute("class")+" pending");
        }else if(container.getAttribute("class").indexOf("offline") !== -1){
            container.setAttribute("class",container.getAttribute("class").replace("offline","pending"));
        }else if(container.getAttribute("class").indexOf("online") !== -1){
            container.setAttribute("class",container.getAttribute("class").replace("online","pending"));
        }
        path.setAttribute("status","Pending");
    } else if(success){
        container.setAttribute("class",container.getAttribute("class").replace("pending","online"));
        path.setAttribute("status","Online");
    } else if(!success){
        container.setAttribute("class",container.getAttribute("class").replace("pending","offline"));
        path.setAttribute("status","Offline");
    }else{
        console.log("error: function 'updatePrinterStatus' has mis-fired. No valid success parameter given.");
    }
}

function rotatePath(pathD, rotation){
    var original = pathD;
    coorIgnorePattern = /\s*M\s*[-+]?[0-9]*\.?[0-9]+]]]s*,\s*[-+]?[0-9]*\.?[0-9]+\s*M/g;
    pathD = pathD.replace(coorIgnorePattern,"M");
    var mPattern = /\s*M\s*([-+]?[0-9]*\.?[0-9]+)\s*,\s*([-+]?[0-9]*\.?[0-9]+)\s*/,
    lPattern = /\s*L\s*([-+]?[0-9]*\.?[0-9]+)\s*,\s*([-+]?[0-9]*\.?[0-9]+)\s*/,
    qPattern = /\s*Q\s*([-+]?[0-9]*\.?[0-9]+)\s*,\s*([-+]?[0-9]*\.?[0-9]+)\s*([-+]?[0-9]*\.?[0-9]+)\s*,\s*([-+]?[0-9]*\.?[0-9]+)\s*/,
    aPattern = /\s*A\s*([-+]?[0-9]*\.?[0-9]+)\s*,\s*([-+]?[0-9]*\.?[0-9]+)\s*([-+]?[0-9]*\.?[0-9]+)\s*([-+]?[0-9]*\.?[0-9]+)\s*,\s*([-+]?[0-9]*\.?[0-9]+)\s*([-+]?[0-9]*\.?[0-9]+)\s*,([-+]?[0-9]*\.?[0-9]+)\s*/,
    zPattern = /\s*Z\s*/;
    var mMatch,
    lMatch,
    qMatch,
    aMatch,
    zMatch;
    var rotatedCoordSets = [],
    minX = Number.MAX_VALUE,
    minY = Number.MAX_VALUE,
    x1,x2,y1,y2,
    rotatedPath = "",
    tempCoordSet;
    while (((mMatch = mPattern.exec(pathD)) !== null && (mMatch = mPattern.exec(pathD)).index === 0) ||
        ((lMatch = lPattern.exec(pathD)) !== null && (lMatch = lPattern.exec(pathD)).index === 0) ||
        ((qMatch = qPattern.exec(pathD)) !== null && (qMatch = qPattern.exec(pathD)).index === 0) ||
        ((aMatch = aPattern.exec(pathD)) !== null && (aMatch = aPattern.exec(pathD)).index === 0) ||
        ((zMatch = zPattern.exec(pathD)) !== null && (zMatch = zPattern.exec(pathD)).index === 0)) {
        if(mMatch !== undefined && mMatch !== null && mMatch.index === 0){
            pathD = pathD.replace(mPattern,"");
            tempCoordSet = rotateCoordSet(mMatch[1],mMatch[2],rotation);
            x1=tempCoordSet[0];
            y1=tempCoordSet[1];
            rotatedCoordSets.push(["M",x1,y1]);
            if(x1 < minX){
                minX = x1;
            }
            if(y1 < minY){
                minY = y1;
            }
        } else if(lMatch !== undefined && lMatch !== null && lMatch.index === 0){
            pathD = pathD.replace(lPattern,"");
            tempCoordSet = rotateCoordSet(lMatch[1],lMatch[2],rotation);
            x1=tempCoordSet[0];
            y1=tempCoordSet[1];
            rotatedCoordSets.push(["L",x1,y1]);
            if(x1 < minX){
                minX = x1;
            }
            if(y1 < minY){
                minY = y1;
            }
        } else if(qMatch !== undefined && qMatch !== null && qMatch.index === 0){
            pathD = pathD.replace(qPattern,"");
            tempCoordSet = rotateCoordSet(qMatch[1],qMatch[2],rotation);
            x1=tempCoordSet[0];
            y1=tempCoordSet[1];
            tempCoordSet = rotateCoordSet(qMatch[3],qMatch[4],rotation);
            x2=tempCoordSet[0];
            y2=tempCoordSet[1];
            rotatedCoordSets.push(["Q",x1,y1,x2,y2]);
            if(x1 < minX){
                minX = x1;
            }
            if(y1 < minY){
                minY = y1;
            }
            if(x2 < minX){
                minX = x2;
            }
            if(y2 < minY){
                minY = y2;
            }
        } else if(aMatch !== undefined && aMatch !== null && aMatch.index === 0){
            pathD = pathD.replace(aPattern,"");
            tempCoordSet = rotateCoordSet(aMatch[6],aMatch[7],rotation);
            x1=tempCoordSet[0];
            y1=tempCoordSet[1];
            rotatedCoordSets.push(["A",aMatch[1],aMatch[2],aMatch[3],aMatch[4],aMatch[5],x1,y1]);
            if(x1 < minX){
                minX = x1;
            }
            if(y1 < minY){
                minY = y1;
            }
        } else if(zMatch !== undefined && zMatch !== null && zMatch.index === 0){
            pathD = pathD.replace(zPattern,"");
            rotatedCoordSets.push(["Z"]);
        }
    }
    var xShift = 1.0-minX, yShift = 1.0-minY;
    for (var n = 0; n < rotatedCoordSets.length; n++) {
        if(rotatedCoordSets[n][0] == "M"){
            x1=rotatedCoordSets[n][1]+xShift;
            y1=rotatedCoordSets[n][2]+yShift;
            rotatedPath += "M "+x1+","+y1+" ";
        } else if(rotatedCoordSets[n][0] == "L"){
            x1=rotatedCoordSets[n][1]+xShift;
            y1=rotatedCoordSets[n][2]+yShift;
            rotatedPath += "L "+x1+","+y1+" ";
        } else if(rotatedCoordSets[n][0] == "Q"){
            x1=rotatedCoordSets[n][1]+xShift;
            y1=rotatedCoordSets[n][2]+yShift;
            x2=rotatedCoordSets[n][3]+xShift;
            y2=rotatedCoordSets[n][4]+yShift;
            rotatedPath += "Q "+x1+","+y1+" "+x2+","+y2+" ";
        } else if(rotatedCoordSets[n][0] == "A"){
            x1=rotatedCoordSets[n][6]+xShift;
            y1=rotatedCoordSets[n][7]+yShift;
            rotatedPath += "A "+rotatedCoordSets[n][1]+","+rotatedCoordSets[n][2]+" "+rotatedCoordSets[n][3]+" "+rotatedCoordSets[n][4]+","+rotatedCoordSets[n][5]+" "+x1+","+y1+" ";
        } else if(rotatedCoordSets[n][0] == "Z"){
            rotatedPath += "Z ";
        }
    }
    return rotatedPath;
}

function rotateCoordSet(x,y,rotation){
    x=parseFloat(x);
    y=parseFloat(y);
    var newX=x, newY=y;
    if(rotation == 90){
        newX = -y;
        newY = x;
    } else if(rotation == 180){
        newX = -x;
        newY = -y;
    } else if(rotation == 270){
        newX = y;
        newY = -x;
    } else if(rotation == 360 || rotation === 0){
        return [newX,newY];
    } else {
        var cos = Math.cos((rotation*Math.PI)/180);
        var sin = Math.sin((rotation*Math.PI)/180);
        newX = x*cos - y*sin;
        newY = x*sin + y*cos;
    }
    return [newX,newY];
}

// appends a div to an already existing element, then appends a p tag to that div, then sets the positioning of the div
function addLabelText(container, infoSetsArray, x, y, textWidth, zIndex, display){
    var labelHolder = [];//holds the labels for this one session. will be returned at the end
    //set default value of zIndex to 1
    var containerID=container.getAttribute("id");
    var oldPath = container.getElementsByTagName("path")[0];
    container.setAttribute("id",(containerID+"-group"));

    if(zIndex === undefined || zIndex === null){
        zIndex = "3";
    }
    var originalD = container.getElementsByTagName("path")[0].getAttribute("d");
    var numOfSets = infoSetsArray.length;
    var height = container.getBBox().height;
    var width = container.getBBox().width;
    textWidth = (textWidth===null)?container.getBBox().width:textWidth;
    var chunkHeight = height/numOfSets;
    //establish the clipPath
    var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    //outline set, does nothing but create an outline for the room
    var outlineMask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
    outlineMask.setAttribute("id", containerID+"-maskO");
    outlineMask.setAttribute("class","outline");
    var outlinePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    outlinePath.setAttribute("d",originalD);
    var strokeWidth = getStrokeWidth(oldPath);
    container.removeChild(oldPath);
    outlineMask.appendChild(outlinePath);
    defs.appendChild(outlineMask);
    //filler set, does nothing but create a fill in select spots for when the proper rect is hovered over.
    if(display){
        var fillerClipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
        fillerClipPath.setAttribute("id", containerID+"-clipPathF");
        fillerClipPath.setAttribute("class","filler");
        var fillerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        fillerPath.setAttribute("d",originalD);
        fillerClipPath.appendChild(fillerPath);
        defs.appendChild(fillerClipPath);
    }
    container.appendChild(defs);

    //attach each infoSet
    for(k=0;k<infoSetsArray.length;k++){
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        container.appendChild(g);
        var chr = "";
        if(infoSetsArray.length > 1){
            chr = String.fromCharCode(65 + k); //k shouldn't exceed 25
        }
        g.setAttribute("id", containerID + chr);
        if(display){
            g.setAttribute("class","roomChunk");
            //attach the rect for the current infoSet, which will give a base for placing infoSets, and performing actins relative to each
            var roomChunkRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            g.appendChild(roomChunkRect);
            roomChunkRect.setAttribute("width",(width+strokeWidth));
            roomChunkRect.setAttribute("height",(chunkHeight+strokeWidth));
            roomChunkRect.setAttribute("x",1);
            roomChunkRect.setAttribute("y",((chunkHeight*k)+1));
            roomChunkRect.setAttribute("clip-path","url(#"+fillerClipPath.getAttribute("id")+")");
        }
        //begin establishing attributes
        var infoSet = infoSetsArray[k];
        for(l=0; l < infoSetsArray.length; l++){
            for(var propertyName in infoSet){
                if(infoSet.hasOwnProperty(propertyName)){
                    if(propertyName == "displayName"){
                        text = infoSet[propertyName];
                    } else if(display && infoSet[propertyName] !== null){
                        g.setAttribute(propertyName, infoSet[propertyName]);
                    }
                }
            }
        }
        nameText = wordWrapper(g,textWidth,text,0,"middle");
        nameText.setAttribute("y",(((chunkHeight/2)-(nameText.getBBox().height/2))+(chunkHeight*k)+y));
        nameText.setAttribute("x",((width/2)+x));
        var rectW = nameText.getBBox().width;
        var rectH = nameText.getBBox().height;
        var rectX = nameText.getBBox().x;
        var rectY = nameText.getBBox().y;
        var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("class", "textBGRect");
        rect.setAttribute("width", (rectW+2));
        rect.setAttribute("height", (rectH+2));
        rect.setAttribute("x", (rectX-1));
        rect.setAttribute("y", (rectY-1));
        var label = new Object();
        label.oldG = container;
        label.gID = g.getAttribute("id");
        label.textDOM = g.removeChild(nameText);
        label.rectDOM = rect;
        labelHolder.push(label);
        if(display){ g.addEventListener('click', displayInfo,false); }
    }
    //create a rect so the path outline always shows
    var roomRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");//for the outline
    container.appendChild(roomRect);
    roomRect.setAttribute("class","roomOutline");
    roomRect.setAttribute("width",(width+strokeWidth));
    roomRect.setAttribute("height",(height+strokeWidth));
    roomRect.setAttribute("x",1);//starts at 1,1 because all paths start there.
    roomRect.setAttribute("y",1);
    roomRect.setAttribute("mask","url(#"+outlineMask.getAttribute("id")+")");
    return labelHolder;
}

function wordWrapper(container, width, text, bottomPadding, anchor) {
    if(anchor.toLowerCase() !== "start" && anchor.toLowerCase() !== "middle" && anchor.toLowerCase() !== "end"){
        anchor="start";
    }
    if(anchor.toLowerCase() == "start"){
        horizontalPosition = 0;
    } else if (anchor.toLowerCase() == "middle"){
        horizontalPosition = width/2;
    }else if (anchor.toLowerCase() == "end"){
        horizontalPosition = width;
    }
    var nameText = document.createElementNS("http://www.w3.org/2000/svg", "text");

    nameText.setAttribute("text-anchor", anchor);
    var words = text.split(" ");
    var leftovers = [];
    var chunk;
    unsorted=true;
    var tspans = [];
    var tWidth;
    var tHeight;
    while(unsorted){
        chunk = "";
        for(w=0;w < words.length;w++){
            chunk += words[w];
            if((w) < words.length-1){
                chunk += " ";
            }
        }
        nameText.textContent = chunk;
        container.appendChild(nameText);
        tWidth=nameText.getBBox().width;
        tHeight=nameText.getBBox().height;
        container.removeChild(nameText);
        if(tWidth >= width && words.length > 1){
            leftovers.unshift(words[words.length-1]);
            words.pop();
        } else {
            words = leftovers;
            leftovers = [];
            tspans.push(chunk);
        }
        if(leftovers.length === 0 && words.length === 0){
            unsorted = false;
        }
    }
    nameText.textContent = "";
    container.appendChild(nameText);
    var prevTspanWidth = 0;
    for(w = 0; w < tspans.length; w++){
        var tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        tspan.textContent = tspans[w];
        nameText.appendChild(tspan);
        var curTspanWidth = tspan.getComputedTextLength();
        tspan.setAttribute("dy",(w!==0)?(tHeight+bottomPadding):0);
        tspan.setAttribute("dx", (w===0)?0:(((curTspanWidth/2)+(prevTspanWidth/2))*-1));
        prevTspanWidth = curTspanWidth;
    }
    container.appendChild(nameText);
    return nameText;
}


function addZone(id, objectClass, name, orientation, x, y, coorStr, textX, textY) {
    /*
        id (string)
    
            Chosen element ID to be used later when addressing the element created
            Naming comnvention is FLOORNUMBER - OBJECTNUMBER

        objectClass (string)
    
            Chosen element class to be used later when addressing the element class

        orientation (integer)
    
            number of degrees to rotate the wall clockwise(e.g. 45, 90, 180)

        x & y (integer)
    
            Number of pixels to shift from top and left, as you would position absolutely, -1 will center it on that axis

        coorStr (string)

            a string of a path for the walls

        style (string)

            a string of styles. This will be applied to the root g, as inline CSS.

    */
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    objectClass = objectClass==null?"zone":"zone "+objectClass;
    x=(parseFloat(x) === undefined || parseFloat(x) < 0)?0:parseFloat(x);
    y=(parseFloat(y) === undefined || parseFloat(y) < 0)?0:parseFloat(y);
    //create path for unrotated zone
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    g.setAttribute("class", objectClass);
    g.setAttribute("id", id);
    //rotate path
    path.setAttribute("d",rotatePath(coorStr,orientation));
    g.setAttribute("transform","translate("+x+","+y+")");
    g.appendChild(path);
    whichFloor(id, "zone").appendChild(g);
}

//adds wall to schematic div 
function addWall(id, objectClass, orientation, x, y, coorStr, style) {
    /*
        id (string)
    
            Chosen element ID to be used later when addressing the element created
            Naming comnvention is FLOORNUMBER - OBJECTNUMBER

        objectClass (string)
    
            Chosen element class to be used later when addressing the element class

        orientation (integer)
    
            number of degrees to rotate the wall clockwise(e.g. 45, 90, 180)

        x & y (integer)
    
            Number of pixels to shift from top and left, as you would position absolutely, -1 will center it on that axis

        coorStr (string)

            a string of a path for the walls

        style (string)

            a string of styles. This will be applied to the root g, as inline CSS.

    */
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    objectClass = objectClass==null?"wall":"wall "+objectClass;
    x=(parseFloat(x) === undefined || parseFloat(x) < 0)?0:parseFloat(x);
    y=(parseFloat(y) === undefined || parseFloat(y) < 0)?0:parseFloat(y);
    //create path for unrotated wall
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    g.setAttribute("class", objectClass);
    g.setAttribute("id", id);
    //rotate path
    path.setAttribute("d",rotatePath(coorStr,orientation));
    g.setAttribute("transform","translate("+x+","+y+")");
    g.appendChild(path);
    whichFloor(id, "wall").appendChild(g);
}

//creates an SVG accroding to certain perameters, insie a div. Adds the div to the specific Div set as addToDiv
function addRoom(type, id, objectClass, orientation, x, y, width, height, coorStr, style, textX, textY, textWidth, infoSetsArray, display) {

    /*
        type (integer)
    
            types of offices:
            1:  Normal office, door left
            2:  Normal office, door right
            3:  Cubicle. Accepts path. Makes a dotted line
            4:  Special Office. Takes path string. Look to other, already built offices for examples
    
        id (string)
    
            Chosen element ID to be used later when addressing the element created
            Naming comnvention is FLOORNUMBER-OBJECTNUMBERORNAME

        objectClass (string)
    
            Chosen element class to be used later when addressing the element class

        orientation (number)
    
            number of degrees to rotate the office clockwise(e.g. 45, 90, 180)

        x & y (number)
    
            Number of pixels to shift from top and left, as you would position absolutely, -1 will center it on that axis

        width (number)
    
            width of office. defulat is 48

        height (number)
    
            height of office. defulat is 73

        coorStr (string)

            a string of a path for the walls

        textX & textY (number)
    
            Number of pixels to shift the text contained in the name field from the center. Negative goes to the left or up.

        textWidth (number)
    
            Maximum width for a label. If specified, will set the boundaries for a label's maximum width, and may cause word wrapping. If not specified, the containers width will be used.

        infoSetsArray (array)
    
            Contains the values of the name, fullname, photoLoc, phoneNum, ipAddress, pcName, and wallPlateNum of each
            person within an office. If there are no items within infoSetsArray, it is an empty room, with no label needed.

        display (boolean)
    
            True by default, this variable lets this function know whether or not to allow the displaying of info. If
            it is false, the room will not highlight on mouseover, and no "onclick" attribute will be added.

    */
    if(display != false){
        display = true;
    }
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    objectClass = objectClass==null?"room":"room "+objectClass;

    width = (width === undefined || width === "" || width === null)?48:parseFloat(width);
    height = (height === undefined || height === "" || height === null)?72:parseFloat(height);
    //create path for unrotated office
    if (type == '1') {
        coorStr = "M 1,1 L 6,1 L 6,16 Q 20,16 20,1 L "+(width-1)+",1 L "+(width-1)+","+(height-1)+" L 1,"+(height-1)+" Z";
    } else if (type == '2') {
        coorStr = "M 1,1 L "+((width-1)-20)+",1 Q "+((width-1)-20)+",16 "+((width-1)-5)+",16 L "+((width-1)-5)+",1 L "+(width-1)+",1 L "+(width-1)+","+(height-1)+" L 1,"+(height-1)+" Z";
    } else if (type == '3'){
        objectClass += " cubicle";
    }

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    if(style !== null && style !== undefined && style !== ""){ path.setAttribute("style",style); }

    g.setAttribute("id", id);
    g.setAttribute("class", objectClass);
    //rotate path
    path.setAttribute("d",rotatePath(coorStr,orientation));
    g.setAttribute("transform","translate("+x+","+y+")");
    g.appendChild(path);
    var mouseover = false;
    whichFloor(id, "room").appendChild(g);
    //set click action for info
    var labelTemp = addLabelText(g, infoSetsArray, textX, textY, textWidth, 2, display);
    //call animator function
    return labelTemp;
}

function addPrinter(id, x, y, infoSet) {

    /*
    
        id (string)
    
            chose ID. unique to the printer. nameing scheme is "Floor#-PRT-XXX" e.g. 6-PRT-023

        model (string)
    
            Printer model
    
        fullName (string)
    
            full name of the printer

        x & y (integer)
    
            Number of pixels to shift from top and left, as you would position absolutely, -1 will center it on that axis

        infoSet (object)
    
            Contains the values of the fullName, ipAddress, wallPlateNum, and faxWallPlateNum of a printer

    */
    var objectClass = "printer";
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d","M 5,4 L 5,1 L 13,1 L 13,4 M 13,14 L 17,14 L 17,4 L 1,4 L 1,14 L 5,14 M 5,9 L 5,17 L 13,17 L 13,9 Z");
    g.setAttribute("id", id);
    g.appendChild(path);

    // set all teh attributes
    for(var propertyName in infoSet){
        if(infoSet.hasOwnProperty(propertyName) && infoSet[propertyName]!==null){
            g.setAttribute(propertyName, infoSet[propertyName]);
        }
    }
    path.addEventListener('click', displayInfo,false);
    whichFloor(id, "printer").appendChild(g);
    g.setAttribute("transform","translate("+x+","+y+")");
    //check printer status if IP Address is known
    if(infoSet.ipAddress !== null){
        g.setAttribute("class", objectClass + " networked");
        var iFrameDiv = document.createElement("div");
        iFrameDiv.setAttribute("height",0);
        iFrameDiv.setAttribute("width",0);
        iFrameDiv.setAttribute("id", id+"-iframe");
        var iFrame =  document.createElement("iframe");
        iFrame.src = "http://"+infoSet.ipAddress+"/";
        iFrameDiv.style.display = "none";
        var loaded;
        setTimeout(function(){
            if(loaded != true){
                loaded = false;
                updatePrinterStatus(g, false);
                document.body.removeChild(document.getElementById(iFrameDiv.getAttribute("id")));
            }
        }, 5000);
        iFrame.onload = function(){
            if(loaded != false){
                loaded = true;
                updatePrinterStatus(g, true);
                document.body.removeChild(document.getElementById(iFrameDiv.getAttribute("id")));
            }
        }
        iFrameDiv.appendChild(iFrame);
        document.body.appendChild(iFrameDiv);
        var status = "pending";
        updatePrinterStatus(g, status);
    } else{
        g.setAttribute("class", objectClass + " local");
    }
}

function addSupportBeam(id, orientation, x, y, width, height) {

    /*
    
        id (string)
    
            chose ID. unique to the beam

        orientation (integer)
    
            number of degrees to rotate the beam clockwise(e.g. 45, 90, 180)

        x & y (integer)
    
            Number of pixels to shift from top and left, as you would position absolutely, -1 and null will center it on that axis

        width (integer)
    
            width of beam.

        height (integer)
    
            height of beam.

    */
    var objectClass = "supportBeam";
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    g.setAttribute("id", id);
    g.setAttribute("class", objectClass);
    g.appendChild(path);
    whichFloor(id, "supportBeam").appendChild(g);
    g.setAttribute("transform","translate("+x+","+y+")");
    var coorStr = "M 1,1 L 1,"+height+" L "+width+","+height+" L "+width+",1 Z";
    path.setAttribute("d",rotatePath(coorStr,orientation));
}

function addFilingCabinet(id, x, y, width, height, rows, columns, orientation) {

    /*
        id (string)
    
            chose ID. unique to the filing cabinet

        x & y (integer)
    
            Number of pixels to shift from top and left, as you would position absolutely, -1 will center it on that axis

        width (integer)
    
            width of row in px
    
        height (integer)
    
            height of row in px

        rows & columns (integer)

            number of cabinets in each row and column

        orientation (integer)
    
            number of degrees to rotate clockwise(e.g. 45, 90, 180)

    */
    x=(x === null || x === undefined || x === "")?0:x;
    y=(y === null || y === undefined || y === "")?0:y;
    width=(width === null || width === undefined || width === "")?10:width;
    height=(height === null || height === undefined || height === "")?5:height;
    rows=(rows === null || rows === undefined || rows === "")?1:rows;
    columns=(columns === null || columns === undefined || columns === "")?1:columns;
    orientation=(orientation === null || orientation === undefined || orientation === "")?0:orientation;
    // generate path
    var rowChunk = height/rows;
    var columnChunk = width/columns;
    var coorStr = "";
    for(k=0;k<rows;k++){
        for(j=0;j<columns;j++){
            coorStr+="M "+(columnChunk*j)+","+(rowChunk*k)+" L "+((columnChunk*j)+columnChunk)+","+(rowChunk*k)+" L "+((columnChunk*j)+columnChunk)+","+((rowChunk*k)+rowChunk)+" L "+(columnChunk*j)+","+((rowChunk*k)+rowChunk)+" Z";
        }
    }
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "filingCabinet");
    g.setAttribute("id", id);
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    //rotate path
    path.setAttribute("d",rotatePath(coorStr,orientation));
    g.appendChild(path);
    whichFloor(id, "filingCabinet").appendChild(g);
    g.setAttribute("transform","translate("+x+","+y+")");
    //call animator function
}

function addFurniture(id, coorStr, x, y, orientation) {

    /*
        id (string)
    
            Chosen element ID to be used later when addressing the element created
            Naming comnvention is FLOORNUMBER - OBJECTNUMBER

        orientation (integer)
    
            number of degrees to rotate the furniture clockwise(e.g. 45, 90, 180)

        x & y (integer)
    
            Number of pixels to shift from top and left, as you would position absolutely, -1 will center it on that axis

        coorStr (string)

            a string of a path for the walls

    */
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    x=(parseFloat(x) === undefined || parseFloat(x) < 0)?0:parseFloat(x);
    y=(parseFloat(y) === undefined || parseFloat(y) < 0)?0:parseFloat(y);
    //create path for unrotated furniture
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    g.setAttribute("class", "furniture");
    g.setAttribute("id", id);
    //rotate path
    path.setAttribute("d",rotatePath(coorStr,orientation));
    g.setAttribute("transform","translate("+x+","+y+")");
    g.appendChild(path);
    whichFloor(id, "furniture").appendChild(g);
}


function addLabel(label) {

    /*
        id (string)
    
            Chosen element ID to be used later when addressing the element created
            Naming comnvention is FLOORNUMBER - OBJECTNUMBER

        orientation (integer)
    
            number of degrees to rotate the furniture clockwise(e.g. 45, 90, 180)

        x & y (integer)
    
            Number of pixels to shift from top and left, as you would position absolutely, -1 will center it on that axis

        coorStr (string)

            a string of a path for the walls

    */
    var oldG = label.oldG;
    var re = /translate\([^\d\()]*(\d+)[^\d]*,[^\d]*(\d+)[^\d\)]*\)/;
    var potential = re.exec(oldG.getAttribute("transform"));
    x = potential[1];
    y = potential[2];
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    //create path for unrotated furniture
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    g.setAttribute("class", "label "+oldG.getAttribute("class"));
    g.setAttribute("id", label.gID+"-label");
    g.setAttribute("transform","translate("+x+","+y+")");
    g.appendChild(label.rectDOM);
    g.appendChild(label.textDOM);
    whichFloor(label.gID, "label").appendChild(g);
}

