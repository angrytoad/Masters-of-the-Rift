/**
 * Created by Tom on 25/04/2016.
 */

function setSession(loginId,token){
    localStorage.setItem('motrSession',JSON.stringify({loginId:loginId,token:token}));
}

function getSession(){
    return JSON.parse(localStorage.getItem('motrSession'));
}

function destroySession(){
    localStorage.removeItem('motrSession');
}

function sessionExists(){
    if (localStorage.getItem("motrSession") === null) {
        return false;
    }else{
        return true;
    }
}