import { useEffect, useState } from 'react'
import './App.css'
import web3 from './Web3'
import lottery from './lottery'


function App() {
  const [manager, setManager] = useState('')
  const [players, setPlayers] = useState<string[]>([])
  const [balance, setBalance] = useState('')
  const [value, setValue] = useState('')
  const [message, setMessage] = useState('')


  useEffect( () => {
    lottery.methods.manager().call<string>().then(manager => setManager(manager))
    lottery.methods.getPlayers().call<string[]>().then(players => setPlayers(players))
    web3.eth.getBalance(lottery.options.address!).then(balance => setBalance(balance.toString()))
  }, [])


  const onSubmit = async (event: React.FormEvent<HTMLFormElement> ) => {
    event.preventDefault()

    const account = await web3.eth.getAccounts()

    setMessage("Waiting on transactions success...")

    await lottery.methods.enter().send({
      from: account[0],
      value: web3.utils.toWei(value, "ether")
    })

    setMessage('You have been entered!')
  }

  const onClick = async () => {
    const account = await web3.eth.getAccounts()

    setMessage("Waiting on transactions success...")

    await lottery.methods.pickWinner().send({
      from: account[0]
    })

    setMessage('A winner has been picked!')
  }

  return (
    <>
      <div>
        <h2>Lottery contract</h2>
        <p>
          This contract is managed by {manager}{'\n'}
          There are currently {players.length} people entered
          competing to win {web3.utils.fromWei(balance, 'ether')} ether
        </p>

        <hr />

        <form action="" onSubmit={onSubmit}>
          <h4>Want to try your luck?</h4>

          <div>
            <label htmlFor="">Amount of ether to enter</label>

            <input value={value} type="number" onChange={ e => setValue(e.target.value)}/>
          </div>

          <button>Enter</button>
        </form>
        
        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={onClick}> Pick a winner!</button>
        
        <hr />
        <h1>{message}</h1>
        
      </div>
    </>
  )
}

export default App
