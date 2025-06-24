import { Register } from "../pages/register";
import Swal from 'sweetalert2'

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			openSidebar: false,

			token: localStorage.getItem("token") || null,
			profile: JSON.parse(localStorage.getItem("profile")) || null,
			userSkillsAssociations: null,
			tutorProfile: JSON.parse(localStorage.getItem("tutorProfile")) || null,
			skills: null,
			categories: null,
			userSessions: null,
			achievements: null,
			statistics: null

		},
		actions: {

			login: async (email, password) => {
				const opts = {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						"email": email,
						"password": password
					})
				}

				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/login", opts)
					const data = await resp.json();
					if (!resp.ok) {
						throw new Error(data.msg)
					}
					localStorage.setItem("token", data.access_token);
					setStore({ token: data.access_token })
					getActions().getProfile()
					getActions().getAchievements()
					getActions().getStatistics()
					return true;

				}
				catch (error) {
					Swal.fire({
							position: "center",
							icon: "error",
							title: error,
							background: "#263043",
							color: "#FFFFFF",
							showConfirmButton: false,
							timer: 1500
						});
						return false
					}
			},

			logout: () => {
				localStorage.removeItem("token");
				localStorage.removeItem("profile");
				setStore({ token: null, profile: null });
			},

			getProfile: async () => {
				const store = getStore()

				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/protected", {
						method: 'GET',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.token}`
						},
					})
					if (!resp.ok) {
						Swal.fire({
							position: "center",
							icon: "error",
							title: data.msg,
							background: "#263043",
							color: "#FFFFFF",
							showConfirmButton: false,
							timer: 1500
						});
						return false;
					}

					const data = await resp.json();
					localStorage.setItem("profile", JSON.stringify(data));
					console.log(data)
					setStore({ profile: data })
					return true

				}
				catch (error) {
					console.error("there was an error getting the profile");
				}

			},
			getTutorAssociations: async (role) => {
				const store = getStore()

				try {
					// Construct URL with query parameters
					const url = new URL(process.env.BACKEND_URL + "/api/tutor-associations");
					url.searchParams.append("role", role);


					// Fetch the associations from the backend
					const resp = await fetch(url, {
						method: 'GET',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.token}`
						}
					});

					const data = await resp.json();

					if (!resp.ok) {
						throw new Error(data.msg);
					}
					return true
				} catch (error) {
					return false
				}
			},			
			getAssociations: async (level, role, category) => {
				const store = getStore()

				try {
					// Construct URL with query parameters
					const url = new URL(process.env.BACKEND_URL + "/api/skills-joined-table");
					url.searchParams.append("level", level);
					url.searchParams.append("role", role);
					url.searchParams.append("category", category);


					// Fetch the associations from the backend
					const resp = await fetch(url, {
						method: 'GET',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.token}`
						}
					});

					const data = await resp.json();

					if (!resp.ok) {
						throw new Error(data.msg);
					}

					setStore({ userSkillsAssociations: data });
					return true;
				} catch (error) {
					console.log("Error from backend", error);
					return false;
				}
			},
			getTutorProfile: async (id) => {
				const store = getStore()

				try {
					//fetch the associations from the back end
					const resp = await fetch(process.env.BACKEND_URL + `/api/users/${id}`, {
						method: 'GET',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${localStorage.getItem("token")}`
						},
					})
					const data = await resp.json()

					if (!resp.ok) {
						throw new Error(data.msg)
					}
					console.log(data)
					localStorage.setItem("tutorProfile", JSON.stringify(data));
					setStore({ tutorProfile: data })
					return id
				}

				catch (error) {
					console.log("Error from backend", error)
					return false
				}
			},
			getCategories: 	async () => {
				const store = getStore()

				try {
					//fetch the associations from the back end
					const resp = await fetch(process.env.BACKEND_URL + `/api/categories`, {
						method: 'GET',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.token}`
						},
					})
					const data = await resp.json()

					if (!resp.ok) {
						throw new Error(data.msg)
					}
					console.log(data)
					setStore({ categories: data })
					return true
				}

				catch (error) {
					console.log("Error from backend", error)
					return false
				}
			},

			getSkills: async () => {
				const store = getStore()
				try {
					//fetch the associations from the back end
					const resp = await fetch(`${process.env.BACKEND_URL}/api/skills`, {
						method: 'GET',
						headers: {
							"Content-Type": "application/json"
							// "Authorization": `Bearer ${store.token}`

						},
					})
					const data = await resp.json()
					if (!resp.ok) {
						throw new Error(data.msg)
					}
					console.log(data)
					setStore({ skills: data })
					return true
				}
				catch (error) {
					console.log("Error from backend", error)
					return false
				}
			},

			editProfile: async (newUser) => {
				const store = getStore()
				try {
					const res = await fetch(process.env.BACKEND_URL + `/api/profile`, {
						method: 'PUT',
						body: JSON.stringify(
							newUser
						),
						headers: {
							'Content-Type': 'application/json',
							"Authorization": `Bearer ${localStorage.getItem("token")}`
						},
					})
					const data = await res.json();
					if (res.ok) {
						getActions().getProfile()
						setStore({ profile: newUser })
						localStorage.setItem("profile", JSON.stringify(newUser));
						Swal.fire({
							position: "center",
							icon: "success",
							title: data.mensaje,
							background: "#263043",
							color: "#FFFFFF",
							showConfirmButton: false,
							timer: 1500
						});

					}
				} catch (error) {
					return false

				}

			},
			createAssociation: async (skill, role, level) => {
				const store = getStore()
				try {
					const res = await fetch(process.env.BACKEND_URL + `/api/associations`, {
						method: 'POST',
						body: JSON.stringify({
							"skill": skill,
							"role": role,
							"level": level
						}
						),
						headers: {
							'Content-Type': 'application/json',
							"Authorization": `Bearer ${store.token}`
						},
					})
					const data = await res.json()
					if (!res.ok) {
						throw new Error(data.msg)

					}
					Swal.fire({
						position: "center",
						icon: "success",
						title: data.msg,
						background: "#263043",
						color: "#FFFFFF",
						showConfirmButton: false,
						timer: 1500
					});
					return true 
				} catch (error) {
					Swal.fire({
						position: "center",
						icon: "error",
						title: error,
						background: "#263043",
						color: "#FFFFFF",
						showConfirmButton: false,
						timer: 1500
					});
					return false

				}

			},
			editAssociation: async (id, skill_id, role, level) => {
				const store = getStore()
				try {
					const res = await fetch(process.env.BACKEND_URL + `/api/associations/${id}`, {
						method: 'PUT',
						body: JSON.stringify({
							"skill_id": parseInt(skill_id),
							"role": role,
							"level": level
						}

						),
						headers: {
							'Content-Type': 'application/json',
							"Authorization": `Bearer ${localStorage.getItem("token")}`
						},
					})
					const data = await res.json()
					if (res.ok) {
						await getActions().getProfile()
						Swal.fire({
							position: "center",
							icon: "success",
							title: data.mensaje,
							background: "#263043",
							color: "#FFFFFF",
							showConfirmButton: false,
							timer: 1500
						});

					}
				} catch (error) {
					return false

				}

			},
			scheduleSession: async (sessionDetails) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/sessions", {
						method: 'POST',
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(sessionDetails)
					})
					const data = await resp.json();
					if (!resp.ok) {
						throw new Error(data.msg)
					}

					// setStore({ token: data.access_token })
					// getActions().getProfile()
					Swal.fire({
						position: "center",
						icon: "success",
						title: data.msg,
						background: "#263043",
						color: "#FFFFFF",
						showConfirmButton: false,
						timer: 1500
					});
					return true

				}
				catch (error) {
					alert(error)
					return false
				}

			},

			getUserSessions: async (status="") => {
				const store = getStore()

				try {
					// Construct URL with query parameters
					const url = new URL(process.env.BACKEND_URL + "/api/user-sessions");
					url.searchParams.append("status", status);
					// url.searchParams.append("role", role);
					// url.searchParams.append("category", category);


					// Fetch the sessions from the backend
					const resp = await fetch(url, {
						method: 'GET',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.token}`
						}
					});

					const data = await resp.json();

					if (!resp.ok) {
						throw new Error(data.msg);
					}
					setStore({ userSessions: data.sessions });
					return true;
				} catch (error) {
					console.log("Error from backend", error);
					return false;
				}
			},
			editSession: async (status, id) => {
				const store = getStore()
				try {
					const res = await fetch(process.env.BACKEND_URL + `/api/sessions/${id}`, {
						method: 'PUT',
						body: JSON.stringify({
							"status": status
						}

						),
						headers: {
							'Content-Type': 'application/json',
							"Authorization": `Bearer ${store.token}`
						},
					})
					const data = await res.json()
					if (!res.ok) {
						throw new Error(data.msg);
					}

					Swal.fire({
						position: "center",
						icon: "success",
						title: data.msg,
						background: "#263043",
						color: "#FFFFFF",
						showConfirmButton: false,
						timer: 1500
					});
					// These functions are marked as async now
					await getActions().getUserSessions();
					await getActions().getAchievements();
					await getActions().getStatistics();
					return true

				} catch (error) {
					console.error(error)
					return false

				}

			},
			getAchievements: async () => {
				const store = getStore()
				try {
					const res = await fetch(process.env.BACKEND_URL + "/api/achievements", {
						method: 'GET',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.token}`
						},
					})
					const data = await res.json();
					if (!res.ok) {
						throw new Error(data.msg);
					}
					console.log(data.details)
					setStore({ achievements: data.details })

				}
				catch (error) {
					console.error(error);
				}

			},
			getStatistics: async () => {
				const store = getStore()
				try {
					const res = await fetch(process.env.BACKEND_URL + "/api/statistics", {
						method: 'GET',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.token}`
						},
					})
					const data = await res.json(); 
					if (!res.ok) {  
						throw new Error(data.msg); 
					}
					console.log(data.details)
					setStore({ statistics: data.details }) 

				}
				catch (error) {
					console.error(error);
				}

			},
			sendImage: async (file) => {
				const store = getStore()
				const formData = new FormData();
				formData.append('image', file);
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/image", {
					  method: 'POST',
					  body: formData,
					});
					const data = await resp.json()
					console.log(data.url)
					// setHotelData({ ...hotelData, imageURL: data.url })
					// actions.editProfile({ ...store.profile, image: data.url })
					// onChange={(e) => setNewUser({ ...newUser, number: e.target.value })} function para cambiar estado de variable input
					console.log({ ...store.profile, image: data.url })
					return data.url

				  } catch (error) {
					console.error(error)
				  }

			},

			addFavorite: async (id) => {
				const store = getStore()
					const actions = getActions()
					const currentFavorite = store.profile.favorites && store.profile.favorites.find(item => item.favorite_user_id == id)
					if (currentFavorite) {

						actions.deleteFavorite(currentFavorite.id)
						actions.getProfile()

						return null
					}
					const res = await fetch(process.env.BACKEND_URL + `/api/favorites`, {
						method: 'POST',
						body: JSON.stringify({
							"favorite_user_id": parseInt(id),
						}

						),
						headers: {
							'Content-Type': 'application/json',
							"Authorization": `Bearer ${store.token}`
						},
					})
					const data = await res.json()
					console.log(res.status)
					if (res.status == 404 || res.status == 403) {
						Swal.fire({
							position: "center",
							icon: "error",
							title: data.msg,
							background: "#263043",
							color: "#FFFFFF",
							showConfirmButton: false,
							timer: 1500
						});
						return false
					}
					// if(res.status == 401) {
					// 	getActions().logout()
					// }

					Swal.fire({
						position: "center",
						icon: "success",
						title: data.msg,
						background: "#263043",
						color: "#FFFFFF",
						showConfirmButton: false,
						timer: 1500
					});
					// actions.getUserSessions()
					actions.getProfile()
					return true


			},

			deleteFavorite: async (id) => {
				const store = getStore()
				try {
					const res = await fetch(process.env.BACKEND_URL + `/api/favorites/${id}`, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
							"Authorization": `Bearer ${store.token}`
						},
					})
					const data = await res.json()
					if (!res.ok) {
						// if(res.status == 401) getActions().logout()
						
						throw new Error(data.msg);
					}

					Swal.fire({
						position: "center",
						icon: "success",
						title: data.msg,
						background: "#263043",
						color: "#FFFFFF",
						showConfirmButton: false,
						timer: 1500
					});
					getActions().getProfile()
					return true

				} catch (error) {
					console.error(error)
					return false

				}

			},








			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			openSidebarToggle: () => {
				const store = getStore()
				setStore({ openSidebar: !store.openSidebar })
			},

			register: async (name,email,number,password,gender,country,city) => {

				try{
					let datos={
						email:email,
						name:name,
						password:password,
						number:number,
						gender:gender,
						country:country,
						city:city
					};
					const resp =await fetch(process.env.BACKEND_URL + "/api/signup",{
						method:"POST",
						headers:{"Content-Type":"application/json",
						},
						body:JSON.stringify(datos),
					});
					const data = await resp.json();
					if (!resp.ok) {
						throw new Error(data.msg);
					}
					Swal.fire({
						position: "center",
						icon: "success",
						title: data.msg,
						background: "#263043",
						color: "#FFFFFF",
						showConfirmButton: false,
						timer: 1500
					});
					localStorage.setItem("token", data.token);
					setStore({ token: data.token })
					return true;
				}catch(error){
					Swal.fire({
						position: "center",
						icon: "error",
						title: error,
						background: "#263043",
						color: "#FFFFFF",
						showConfirmButton: false,
						timer: 1500
					});
					console.error(error)
					return false;
				}


			}
		}
	};
};

export default getState;
