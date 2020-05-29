// import React from 'react'

// class LoginForm extends React.Component {

//     state = {
//         email: "",
//         password: ""
//     }

//     handleChange = (e) => {
//         this.setState({
//             [e.target.name]: e.target.value
//         })
//     }

//     handleSubmit = (e) => {
//         e.preventDefault()
              
//         fetch(`${process.env.REACT_APP_API_CALL}/login`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Accept": "application/json"
//             },
//             body: JSON.stringify(this.state)
//         })
//             .then(response => response.json())
//             .then(response => {
//                 if (response.errors) {
//                     alert(response.errors)
//                 } else {
//                     this.props.setCurrentUser(response)
//                 }
//             })
//     }
    
//     render () {
//         return (
//             <div>
//                 <form onSubmit={this.handleSubmit}>
//                     <input name="email" value={this.state.email} onChange={this.handleChange} placeholder="Email"/>
//                     <input name="password" value={this.state.password} type="password" onChange={this.handleChange} placeholder="password"/>
//                     <button type="submit">Log In</button>
//                 </form>
//             </div>
//         )
//     }
// }

// export default LoginForm