import React, { Component } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export const Footer = () => {

	const location = useLocation();
    const excludePaths = ["/dashboard","/learn","/history","/profile","/favorites"]; //insert in this array other paths where navbar is not wanted.
    const shouldExcludeFooter = excludePaths.includes(location.pathname);

    if (shouldExcludeFooter) {
        return null; // Don't render anything if the current path is included in excludePaths
    }

	return(
	<footer className="footer bg-dark">

		<div className="p-5 d-flex justify-content-between">
			
			<div className="text-light d-flex flex-column">
				 	<Link to="/">
						<button className="bg-dark text-light border-0">Home</button>
					</Link>
				 	<Link to="/demo	">
						<button className="bg-dark text-light border-0">Blog/News</button>
					</Link>
				 	<Link to="/demo	">
						<button className="bg-dark text-light border-0">How it Works?</button>
					</Link>
				 	<Link to="/demo	">
						<button className="bg-dark text-light border-0">Pricing</button>
					</Link>
				 	<Link to="/demo	">
						<button className="bg-dark text-light border-0">Testimonials</button>
					</Link>
			</div>		
			<div className="vertical-line ms-4"></div>

			<div className="my-auto">
				<Link to="/demo	">
					<button className="bg-dark text-light border-0 ">Testimonials</button>
				</Link>
				
				<Link to="/demo	">
					<button className="bg-dark text-light border-0">Testimonials</button>
				</Link>
				<Link to="/demo	">
					<button className="bg-dark text-light border-0">Testimonials</button>
				</Link>
			</div>
			<div className="vertical-line ms-4"></div>

			<div className="text-light d-flex flex-column">
				<h6>Find Us!</h6>
				<span><i className="fa-brands fa-instagram"></i> username</span>
				<span><i className="fa-brands fa-facebook"></i> username</span>
				<span><i className="fa-brands fa-x-twitter"></i> username</span>
			</div>
		</div>
	</footer>
	)

};
