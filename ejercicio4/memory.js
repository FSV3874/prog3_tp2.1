class Card {
    constructor(name, img) {
        this.name = name;
        this.img = img;
        this.isFlipped = false;
        this.element = this.#createCardElement();
    }

    #createCardElement() {
        const cardElement = document.createElement("div");
        cardElement.classList.add("cell");
        cardElement.innerHTML = `
          <div class="card" data-name="${this.name}">
              <div class="card-inner">
                  <div class="card-front"></div>
                  <div class="card-back">
                      <img src="${this.img}" alt="${this.name}">
                  </div>
              </div>
          </div>
      `;
        return cardElement;
    }

    #flip() {
        const cardElement = this.element.querySelector(".card");
        cardElement.classList.add("flipped");
    }

    #unflip() {
        const cardElement = this.element.querySelector(".card");
        cardElement.classList.remove("flipped");
    }

     //Definir el método `toggleFlip()` que cambia el estado de volteo 
    // de la carta en función de su estado actual.
    toggleFlip(){
        if(this.isFlipped){
            this.#unflip();
        }else{
            this.#flip();
        }
        this.isFlipped = !this.isFlipped;
    }

    //Implementar el método `matches(otherCard)` que verifica si la 
    //carta actual coincide con otra carta.
    matches(otherCard){
        return this.name === otherCard.name;
    }
}

class Board {
    constructor(cards) {
        this.cards = cards;
        this.fixedGridElement = document.querySelector(".fixed-grid");
        this.gameBoardElement = document.getElementById("game-board");
    }

    #calculateColumns() {
        const numCards = this.cards.length;
        let columns = Math.floor(numCards / 2);

        columns = Math.max(2, Math.min(columns, 12));

        if (columns % 2 !== 0) {
            columns = columns === 11 ? 12 : columns - 1;
        }

        return columns;
    }

    #setGridColumns() {
        const columns = this.#calculateColumns();
        this.fixedGridElement.className = `fixed-grid has-${columns}-cols`;
    }

    render() {
        this.#setGridColumns();
        this.gameBoardElement.innerHTML = "";
        this.cards.forEach((card) => {
            card.element
                .querySelector(".card")
                .addEventListener("click", () => this.onCardClicked(card));
            this.gameBoardElement.appendChild(card.element);
        });
    }

    onCardClicked(card) {
        if (this.onCardClick) {
            this.onCardClick(card);
        }
    }

        //El método shuffleCards() mezcla las cartas utilizando el 
    //algoritmo de Fisher-Yates.
    shuffleCards(){
        for(let i = this.cards.length - 1; i > 0; i--) {
            const j = math.floor(Math.random() * (i+1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    //El método flipDownAllCards() pone todas las cartas en su 
    //estado inicial (no volteadas).
    flipDownAllCards(){
        this.cards.forEach(card => {
            if (card.isFlipped){
                card.toggleFlip();
            }
        });
    }

    //El método reset() mezcla las cartas, las voltea a su estado 
    //inicial y renderiza el tablero.
    reset(){
        this.shuffleCards();
        this.flipDownAllCards();
        this.render();
    }
}

class MemoryGame {
    constructor(board, flipDuration = 500) {
        this.board = board;
        this.flippedCards = [];
        this.matchedCards = [];
        if (flipDuration < 350 || isNaN(flipDuration) || flipDuration > 3000) {
            flipDuration = 350;
            alert(
                "La duración de la animación debe estar entre 350 y 3000 ms, se ha establecido a 350 ms"
            );
        }
        this.flipDuration = flipDuration;
        this.board.onCardClick = this.#handleCardClick.bind(this);
        this.board.reset();
    }

    #handleCardClick(card) {
        if (this.flippedCards.length < 2 && !card.isFlipped) {
            card.toggleFlip();
            this.flippedCards.push(card);

            if (this.flippedCards.length === 2) {
                setTimeout(() => this.checkForMatch(), this.flipDuration);
            }
        }
    }

    //El método checkForMatch() verifica si las dos cartas volteadas coinciden. Si coinciden, 
    //las añade al conjunto de cartas emparejadas; si no, las vuelve a voltear.
    checkForMatch(){
        const [card1, card2] = this.flippedCards;
        if (card1.matchedCards.push(card1, card2)){
            this.matchedCards.push(card1, card2);
        } else {
            card1.toggleFlip();
            card2.toggleFlip();
        }
        this.flippedCards = [];
    }

    //El método resetGame() reinicia el juego reseteando las cartas volteadas y emparejadas,
    // y luego reinicia el tablero.
    resetGame(){
        this.flippedCards = [];
        this.matchedCards = [];
        this.board.reset();
    }

}

document.addEventListener("DOMContentLoaded", () => {
    const cardsData = [
        { name: "Python", img: "./img/Python.svg" },
        { name: "JavaScript", img: "./img/JS.svg" },
        { name: "Java", img: "./img/Java.svg" },
        { name: "CSharp", img: "./img/CSharp.svg" },
        { name: "Go", img: "./img/Go.svg" },
        { name: "Ruby", img: "./img/Ruby.svg" },
    ];

    const cards = cardsData.flatMap((data) => [
        new Card(data.name, data.img),
        new Card(data.name, data.img),
    ]);
    const board = new Board(cards);
    const memoryGame = new MemoryGame(board, 1000);

    document.getElementById("restart-button").addEventListener("click", () => {
        memoryGame.resetGame();
    });
});
