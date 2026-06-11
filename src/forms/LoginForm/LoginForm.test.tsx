import {describe, it, expect, vi} from "vitest";
import {render, screen, fireEvent} from "@testing-library/react";
import {TestWrapper} from "../../tests/testHelpers";
import {LoginForm} from "./LoginForm";

describe("LoginForm", () => {
	it("renders the login heading", () => {
		render(
			<TestWrapper>
				<LoginForm />
			</TestWrapper>,
		);
		expect(screen.getByRole("heading")).toBeInTheDocument();
	});

	it("renders the email input", () => {
		render(
			<TestWrapper>
				<LoginForm />
			</TestWrapper>,
		);
		expect(screen.getByPlaceholderText("EMAIL")).toBeInTheDocument();
	});

	it("renders the password input", () => {
		render(
			<TestWrapper>
				<LoginForm />
			</TestWrapper>,
		);
		expect(
			document.querySelector('input[name="password"]'),
		).toBeInTheDocument();
	});

	it("renders a submit button", () => {
		render(
			<TestWrapper>
				<LoginForm />
			</TestWrapper>,
		);
		// Button is either a submit type or has login-related text
		expect(document.querySelector('button[type="submit"]')).toBeInTheDocument();
	});

	it("renders a link to the registration page (Створити акаунт)", () => {
		render(
			<TestWrapper>
				<LoginForm />
			</TestWrapper>,
		);
		expect(
			screen.getByRole("link", {name: "Створити акаунт"}),
		).toBeInTheDocument();
	});

	it("renders a link to the forgot-password page", () => {
		render(
			<TestWrapper>
				<LoginForm />
			</TestWrapper>,
		);
		expect(
			screen.getByRole("link", {name: "Забули пароль?"}),
		).toBeInTheDocument();
	});

	it("renders without crashing", () => {
		render(
			<TestWrapper>
				<LoginForm />
			</TestWrapper>,
		);
		expect(screen.getByRole("heading")).toBeInTheDocument();
	});

	it("shows validation error when invalid email is typed", () => {
		render(
			<TestWrapper>
				<LoginForm />
			</TestWrapper>,
		);
		fireEvent.change(screen.getByPlaceholderText("EMAIL"), {
			target: {value: "bad-email"},
		});
		expect(screen.getByRole("alert")).toBeInTheDocument();
	});
});
