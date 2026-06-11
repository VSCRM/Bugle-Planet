/**
 * Tests for PasswordStrengthHint.
 * Tests check semantic attributes and text content, not CSS module class names
 * (which are hashed and unavailable from outside the component).
 */
import {describe, it, expect} from "vitest";
import {render, screen} from "@testing-library/react";
import {PasswordStrengthHint} from "./PasswordStrengthHint";
import {LocaleWrapper} from "../../tests/testHelpers";
import {TRANSLATIONS} from "../../i18n/translations";

const t = TRANSLATIONS.uk.passwordStrength;

const renderHint = (password: string) =>
	render(
		<LocaleWrapper>
			<PasswordStrengthHint password={password} />
		</LocaleWrapper>,
	);

describe("PasswordStrengthHint", () => {
	it("renders nothing for an empty password", () => {
		const {container} = renderHint("");
		expect(container.firstChild).toBeNull();
	});

	it("renders a weak label for a short password", () => {
		renderHint("ab");
		expect(screen.getByTestId("password-strength")).toBeInTheDocument();
		expect(screen.getByText(t.weak)).toBeInTheDocument();
	});

	it("renders a medium label for a moderately strong password", () => {
		renderHint("Hello1");
		expect(screen.getByText(t.medium)).toBeInTheDocument();
	});

	it("renders a strong label for a very strong password", () => {
		renderHint("Str0ng!Pass");
		expect(screen.getByText(t.strong)).toBeInTheDocument();
	});

	it("renders a weak indicator for a Cyrillic password", () => {
		renderHint("Пароль1");
		expect(screen.getByText(t.weak)).toBeInTheDocument();
	});

	it("has an accessible progressbar role", () => {
		renderHint("Hello1");
		expect(screen.getByRole("progressbar")).toBeInTheDocument();
	});

	it("has aria-live=polite for screen readers", () => {
		renderHint("Hello1");
		expect(screen.getByTestId("password-strength")).toHaveAttribute(
			"aria-live",
			"polite",
		);
	});
});
