import React from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

class Verification extends React.Component{
    async componentDidMount(){
        const token = this.props.location.search.substring(1)

	        try{
	            const res = await Axios.post("http://localhost:1000/user/verification", {token})
	            console.log(res.data)
	        }
	        catch(err) {
	            console.log(err)
	        }
    }
    render(){
        return (
            <div style={styles.container}>
                <h3 style={{textAlign: 'center'}}>Your Account Has Been Verified</h3>
                <div style={{textAlign: 'center'}}>
                <Button as={Link} to="/login">
                    Login
                </Button>
                </div>
            </div>
        );
    }
}



const styles = {
	container: {
		margin: "auto",
		height: 400,
		width: 500,
        alignItems: "center",
        marginTop: 200

	},
};
export default Verification;
