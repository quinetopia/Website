window.onload = function(){
    console.log("in window load");
    var submitButton = document.getElementById("memeForm");

    submitButton.addEventListener("submit", function (event){
        event.preventDefault();
        var memeURL = document.getElementById("imageURLInput");
        var topText = document.getElementById("topTextInput")
        var memeSpace = document.getElementById("memeSpace");
        var bottomText = document.getElementById("bottomTextInput");
        var memeSpace = document.getElementById("memeSpace");
        
        var newMemeImage=document.createElement("img");
        newMemeImage.src=memeURL.value;
        newMemeImage.className="memeImage";
        var newMemeTopText=document.createElement("div");
        newMemeTopText.className="topText";
        newMemeTopText.innerText=topText.value;
        var newMemeBottomText=document.createElement("div");
        newMemeBottomText.className="bottomText";
        newMemeBottomText.innerText=bottomText.value;
        var newMeme= document.createElement("div");
        newMeme.className="memeContainer";
        newMeme.appendChild(newMemeImage);
        newMeme.appendChild(newMemeTopText);
        newMeme.appendChild(newMemeBottomText);
        newMeme.addEventListener('click', deleteMeme)
        memeSpace.appendChild(newMeme);

        memeForm.reset();
    });

    function deleteMeme(event){
        var delImage=event.target;
        delImage.parentElement.remove();
    }

/*use https://stackoverflow.com/questions/9714525/javascript-image-url-verify to help with verifying the image would load?*/
    

}