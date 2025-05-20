<template>
	<div class="auth-layout">
		<!-- Left Panel -->
		<div class="left-panel">
			<h1>{{ isLogin ? "С возвращением!" : "Присоединьтесь к нам" }}</h1>
			<p>{{ isLogin ? "Войдите, чтобы продолжить" : "Зарегистрируйтесь, чтобы начать" }}</p>
		</div>

		<!-- Right Panel -->
		<div class="right-panel">
			<AuthCard
				:title="isLogin ? 'Вход' : 'Регистрация'"
				:subtitle="isLogin ? 'Введите логин и пароль' : 'Заполните данные о себе'"
			>
				<!-- Show error message -->

				<form @submit.prevent="handleSubmit" class="auth-form">
					<!-- Register fields -->
					<input v-model="form.email" type="email" placeholder="Email" v-if="!isLogin" required />

					<!-- Common fields -->
					<input v-model="form.username" placeholder="Имя пользователя" required />
					<input v-model="form.password" type="password" placeholder="Пароль" required />
					<div v-if="errorMessage" class="error-message">
						{{ errorMessage }}
					</div>

					<!-- Submit Button -->
					<button type="submit">{{ isLogin ? "Войти" : "Зарегистрироваться" }}</button>

					<!-- Toggle Link -->
					<p class="small-text">
						{{ isLogin ? "Еще не зарегистрированы?" : "Уже есть аккаунт?" }}
						<a href="#" @click.prevent="toggleMode">
							{{ isLogin ? "Регистрация" : "Вход" }}
						</a>
					</p>
				</form>
			</AuthCard>
		</div>
	</div>
</template>

<script>
import AuthCard from "@/components/AuthCard.vue";

export default {
	name: "AuthView",
	components: {
		AuthCard,
	},
	data() {
		return {
			isLogin: true,
			form: {
				username: "",
				email: "",
				password: "",
			},
			errorMessage: null,
		};
	},
	methods: {
		toggleMode() {
			this.isLogin = !this.isLogin;
		},
		async handleSubmit() {
			const endpoint = this.isLogin ? "/login" : "/register";
			const body = this.isLogin
				? { username: this.form.username, password: this.form.password }
				: { username: this.form.username, email: this.form.email, password: this.form.password };

			try {
				const response = await fetch(`http://localhost:8000/api/v1/auth${endpoint}`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(body),
				});

				if (!response.ok) throw new Error(`${this.isLogin ? "Login" : "Registration"} failed`);

				const data = await response.json();

				localStorage.setItem("token", data.access_token);
				this.$router.push("/");
			} catch (error) {
				this.errorMessage = this.isLogin ? "Invalid credentials" : "Registration failed";

				// Optional: auto-hide after 5s
				setTimeout(() => {
					this.errorMessage = null;
				}, 5000);
			}
		},
	},
};
</script>

<style scoped>
.auth-layout {
	display: flex;
	height: 100vh;
	width: 100%;
	font-family: "Arial", sans-serif;
}

/* Left Panel */
.left-panel {
	flex: 1;
	background-color: #2c3e50; /* Solid brand color */
	color: white;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 2rem;
	text-align: center;
}

.left-panel h1 {
	margin-bottom: 1rem;
	font-size: 2.2rem;
}

.left-panel p {
	font-size: 1.1rem;
	opacity: 0.9;
}

/* Right Panel */
.right-panel {
	flex: 2;
	background-color: #f9f9f9;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* Form Styles */
.auth-form {
	width: 100%;
	max-width: 360px;
}

.auth-form input {
	width: 100%;
	padding: 0.75rem 1rem;
	margin-bottom: 1rem;
	border: 1px solid #ccc;
	border-radius: 6px;
	font-size: 1rem;
}

.auth-form button {
	width: 100%;
	padding: 0.75rem;
	background-color: #2c3e50;
	color: white;
	border: none;
	border-radius: 6px;
	font-size: 1rem;
	cursor: pointer;
}

.auth-form button:hover {
	background-color: #1a252f;
}

.small-text {
	margin-top: 1rem;
	font-size: 0.9rem;
	color: #666;
}

.small-text a {
	color: #2c3e50;
	text-decoration: underline;
	cursor: pointer;
}

.error-message {
	color: #d63031;
	background-color: #f5a8a8;
	padding: 0.75rem 1rem;
	border-left: 4px solid #d63031;
	margin-bottom: 1rem;
	font-size: 0.95rem;
	text-align: left;
	border-radius: 6px;
}
</style>
