var a  = [{name:"ayushi",joinedDate:"2019-11-16"},
            {name:"ayushi",joinedDate:"2019-11-10"},
            {name:"ayushi",joinedDate:"2019-11-06"},
            {name:"avi",joinedDate:"2019-11-17"},
            {name:"ayushi",joinedDate:"2019-11-15"},
            {name:"ayus",joinedDate:null},
            {name:"ayushi",joinedDate:"2019-11-10"},
            {name:"ayushi",joinedDate:"2019-11-08"},
            {name:"ayushi",joinedDate:"2019-11-12"},
            {name:"ayushi",joinedDate:"2019-11-16"},
            {name:"ayushi",joinedDate:"2019-11-10"},
            {name:"abhay",joinedDate:"2019-11-16"},
            {name:"abhay",joinedDate:null},
            {name:"ayushi",joinedDate:null},
            {name:"ayushi",joinedDate:"2019-11-16"},
            {name:"ayushi",joinedDate:"2019-11-16"},
            {name:"ayushi",joinedDate:"2019-10-16"},
            {name:"ayushi",joinedDate:"2019-11-16"},
            {name:"ayushi",joinedDate:"2019-11-04"},
            {name:"bblu",joinedDate:null}]
var arr =[];
a.forEach((obj) =>{obj.joinedDate==null ?arr.push(obj):(obj.name == "ayushi" || obj.name == "abhay")?(obj.joinedDate>="2019-11-09" && obj.joinedDate<="2019-11-16")?arr.push(obj):0:0  
})
    console.log(arr)

