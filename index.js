class Game
{
    constructor(players, pots, dice)
    {
        this.rounds = []
        this.players = players
        this.pots = pots
        this.dice = dice
        this.house = players[0]
    }

    add(player)
    {
        this.players.push(player)
    }
    
    remove(player)
    {
        this.players = this.players.filter((item) => item.id !== player.id);
    }

    addRound(round)
    {
        this.rounds = [...this.rounds,round]
    }

    play() {
        const r1 = new Round(this.getNextRoundId(), this)

        this.players.map ( p => { 
            if ( p.id !== 0)
                r1.placeBet( new Bet ( p, this.dice.getRandomInt(4) , 1))
            else 
                console.log(`no bet for house`)
        })
        
        r1.roll()

        this.pots.map ( p => { 
            if ( p.id === r1.rollResult ){
                this.payOut(p.bets)
            }
            else {
                this.payHouse(p.bets)
            }
            p.removeAllBets()
        })


        game.addRound(r1)

// console.dir(game, { depth: null }); 
        
    }

    payOut(bets) {
        bets.map ( bet => {
            const to = bet.player.ac
            const from = this.pots[bet.pot].ac
            console.log('to',to)            
            to.transfer(from,to,bet.amt,'payOut')
        })
    }

    payHouse(bets) {
        bets.map ( bet => {
            const to = this.house.ac
            const from = this.pots[bet.pot].ac
            console.log('to',to)            
            to.transfer(from,to,bet.amt,'payHouse')
        })
    }

    getNextRoundId(){
        return this.rounds.length
    }
}

class Round
{
    constructor(id, game)
    {
        this.id = id
        this.bets = [] 
        this.game = game
    }

    placeBet(bet){
        this.bets = [...this.bets, bet]

        const pot = this.game.pots[bet.pot]

        const to = pot.ac
        console.log('to',to)

        const from = bet.player.ac
        to.transfer(from,to,bet.amt, 'placeBet')

        pot.addBet(bet)
    }

    roll(){
        this.rollResult = this.game.dice.roll()
    }

}

class Bet
{
    constructor(player, pot, amt)
    {
        this.player = player
        this.pot = pot
        this.amt = amt
    }

}

class Pot
{
    constructor(id,ac)
    {
        this.id = id
        this.ac = ac
        this.bets = [] 
    }

    addBet(bet){
        this.bets.push(bet)
    }
    removeAllBets(){
        this.bets = []
    }

}

class Player
{
    constructor(id,ac)
    {
        this.id = id
        this.ac = ac
    }

}

class Account
{
    constructor(id,bal)
    {
        this.id = id
        this.bal = bal
    }

    balance(){
        return this.bal
    }

    deposit(amt)
    {
        this.bal = this.bal + amt;
    }

    withdraw(amt)
    {
        this.bal = this.bal - amt;
    }

    transfer(from, to, amt, remarks)
    {
        console.log(`transfer: from : ${from.id}, to: ${to.id} amt: ${amt} remarks ${remarks}`)
        let result = from.withdraw(amt)

        if ( result === 0 )
            to.deposit(amt)
        
    }
}

class Dice
{
    constructor(faces)
    {
        this.faces = faces
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }    

    roll()
    {
        return this.getRandomInt(this.faces-1)    
    }
}

const dice = new Dice(4)

const pot1 = new Pot(0,new Account('acc:pot_0',0))
const pot2 = new Pot(1,new Account('acc:pot_1',0))
const pot3 = new Pot(2,new Account('acc:pot_2',0))
const pot4 = new Pot(3,new Account('acc:pot_3',0))

const house = new Player(0,new Account('acc:player_0',10))
const p = new Player(1,new Account('acc:player_1',10))
const p2 = new Player(2,new Account('acc:player_2',10))
const p3 = new Player(3,new Account('acc:player_3',100))

const game = new Game([house,p,p2,p3], [pot1,pot2,pot3,pot4], dice)

game.play()
// console.dir(game, { depth: null }); 


