document.addEventListener("DOMContentLoaded", (event) => {
    const COLORS = ["red", "blue", "green", "yellow", "cyan", "magenta"];
    const CARD_COLOR = "white";
    let match_board_height = 8;
    let match_board_width = match_board_height;

    let random_color_list = setupRandomColorSquares();
    let selected_card_one = null;
    let selected_card_two = null;
    let num_matches = 0;
    let no_match = false;
    let console = document.getElementById("match-console");


    function setupMatchGameBoard(){
        //board
        let match_board = document.getElementById("match-board");
        // match_board.style.border = "2px solid black";
        match_board.style.minWidth = "400px";
        match_board.style.border = "2px solid pink";


        for(let i = 0; i < match_board_height; i++){
            match_board.insertAdjacentHTML("beforeend", `<div class="match_row" row-index="`+i+`" style="display:flex;"></div>`);
            for(let j = 0; j < match_board_width; j++){
                let row = document.getElementsByClassName("match_row")[i];
                let color = CARD_COLOR;
                row.insertAdjacentHTML("beforeend", `<div class="card" hidden-color="`+random_color_list[i*(match_board_width) + j]+`" col-index="`+j+`" 
                    style="width: 50px; 
                    height: 50px; 
                    background-color: `+color+`;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 2px solid black; "></div>`);
            }
        }


        let cards = document.getElementsByClassName("card");
        //add event handler to all squares
        for(let k = 0; k < cards.length; k++){
            cards[k].addEventListener('click', handleCardClick);
        }
    }

    function getCardFromCoords(x, y){
        let row = document.getElementsByClassName("match_row")[y];
        let card = row.children[x];
        return card;
    }

    function setupRandomColorSquares(){
        //duplicate colors
        let color_list = [];

        if( (match_board_height*match_board_width) % 2 != 0){
            console.log("need an even numbered board");
        }
        let i = 0;
        while(color_list.length != match_board_height*match_board_width){
            color_list.push(COLORS[i]);
            color_list.push(COLORS[i]);
            i++;
            if(i == COLORS.length){
                i = 0;
            }
        }
        let result = [];
        while (color_list.length != 0){
            let randomIndex = Math.floor(Math.random() * color_list.length);
            let color = color_list[randomIndex];
            result.push(color);
            color_list.splice(randomIndex, 1);
        }

        return result;
    }


    setupMatchGameBoard();

    function handleCardClick(event){
        //hide previous attempt
        if(no_match == true){
            hideCardColor(selected_card_one);
            hideCardColor(selected_card_two);        
            selected_card_one = null;
            selected_card_two = null;
            no_match = false;
        }

        const clickedCard = event.target;

        showCardColor(clickedCard);
        if(clickedCard.getAttribute("matched") == "" || clickedCard.getAttribute("matched") == null)
        {
            //set clicked card's color to one of the current cards
            if(selected_card_one == null){
                selected_card_one = clickedCard;
            }else if(selected_card_one != null && selected_card_two == null){
                selected_card_two = clickedCard;
            }

            
            if(selected_card_one != null && selected_card_two != null){
                //if not match rehide cards
                if(selected_card_one.getAttribute("hidden-color") != selected_card_two.getAttribute("hidden-color")){
                    console.textContent = "NO MATCH";
                    setTimeout(() => {console.textContent = "";}, 1500);
                    no_match = true;
                    
                }else{
                    num_matches++;
                    selected_card_one.setAttribute("matched", "true");
                    selected_card_two.setAttribute("matched", "true");
                    console.textContent = "MATCH!";
                    setTimeout(() => {console.textContent = "";}, 1500);
                    selected_card_one = null;
                    selected_card_two = null;
                }
            }
        }

        


        //when all matched resulting screen
        if(num_matches == random_color_list.length / 2){
            setTimeout(() => {console.textContent = "VICTORY";}, 1500);
        }
    }

    function showCardColor(card){
        card.style.backgroundColor = card.getAttribute("hidden-color");
    }

    function hideCardColor(card){
        card.style.backgroundColor = CARD_COLOR;
    }

});