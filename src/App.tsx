import { useRef, useState } from 'react'
import './App.css'

const exampleSocket = new WebSocket('ws://localhost:3000/')

interface message {
	method: string
	author: string
	text: string
}

function App() {
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState<message[]>([])
	const [username, setUsername] = useState('')
	const [isSignIn, SetSignIn] = useState(false)

	const messenger = useRef<HTMLInputElement>(null)

	function backToTop() {
		messenger?.current?.scrollIntoView({ block: 'end' })
	}

	const handleClick = async (method: string) => {
		const newMessage = {
			method: method,
			author: username,
			text: message,
		}
		exampleSocket.send(JSON.stringify(newMessage))
		exampleSocket.onmessage = e => {
			const msg = JSON.parse(e.data)
			console.log(msg)
			setMessages(prev => [...prev, msg])
			backToTop()
		}
		setMessage('')
		backToTop()
	}

	return (
		<>
			<h1>Messenger</h1>

			{isSignIn ? (
				<>
					<div className='messages'>
						{messages.map((el, index) => (
							<>
								{el.method === 'message' ? (
									<div
										key={index}
										className={`message ${el.author === username ? 'my' : ''}`}
									>
										<div
											className={`author ${el.author === username ? 'me' : ''}`}
										>
											{el.author}
										</div>
										<div className='text'>{el.text}</div>
									</div>
								) : (
									<>
										<div className='connect'>{el.author} connected</div>
									</>
								)}
							</>
						))}
						<div ref={messenger} className='end'>
							ㅤ
						</div>
					</div>

					<form className='messageForm'>
						<input
							type='text'
							placeholder='Message'
							className='messageInput'
							value={message}
							onChange={e => setMessage(e.target.value)}
						/>
						<input
							type='submit'
							value='Send'
							className='sendBtn'
							onClick={e => {
								e.preventDefault()
								if (message.length > 0) {
									handleClick('message')
								}
							}}
						/>
					</form>
				</>
			) : (
				<form className='connectForm'>
					<input
						type='text'
						placeholder='Name'
						className='nameInput'
						value={username}
						onChange={e => setUsername(e.target.value)}
					/>
					<input
						type='submit'
						value='Connect'
						className='connectBtn'
						onClick={e => {
							e.preventDefault()
							if (username.length > 3) {
								SetSignIn(true)
								handleClick('connect')
							} else {
								alert('Имя пользователя должно быть длинее 3х символов')
							}
						}}
					/>
				</form>
			)}
		</>
	)
}

export default App
