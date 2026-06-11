import {describe, it, expect, vi} from "vitest";
import {render, screen, fireEvent} from "@testing-library/react";
import {CategoryFilter} from "./CategoryFilter";
import {LocaleWrapper} from "../../tests/testHelpers";
import {TRANSLATIONS} from "../../i18n/translations";

const CATEGORIES = ["All", "City", "Sport", "Culture"] as const;

const renderFilter = (active = "All", onChange = vi.fn()) =>
	render(
		<LocaleWrapper>
			<CategoryFilter
				categories={CATEGORIES}
				active={active}
				onChange={onChange}
			/>
		</LocaleWrapper>,
	);

describe("CategoryFilter", () => {
	it("renders a button for every category", () => {
		renderFilter();
		CATEGORIES.forEach((cat) =>
			expect(screen.getByRole("button", {name: cat})).toBeInTheDocument(),
		);
	});

	it("marks only the active category with aria-pressed=true", () => {
		renderFilter("City");
		expect(screen.getByRole("button", {name: "City"})).toHaveAttribute(
			"aria-pressed",
			"true",
		);
		expect(screen.getByRole("button", {name: "All"})).toHaveAttribute(
			"aria-pressed",
			"false",
		);
	});

	it("calls onChange with the correct category when clicked", () => {
		const onChange = vi.fn();
		renderFilter("All", onChange);
		fireEvent.click(screen.getByRole("button", {name: "Sport"}));
		expect(onChange).toHaveBeenCalledWith("Sport");
	});

	it("has an accessible nav landmark with i18n aria-label", () => {
		renderFilter();
		expect(
			screen.getByRole("navigation", {name: TRANSLATIONS.uk.home.categoryNav}),
		).toBeInTheDocument();
	});

	it("active button has aria-pressed=true and other buttons have aria-pressed=false", () => {
		renderFilter("Culture");
		expect(screen.getByRole("button", {name: "Culture"})).toHaveAttribute(
			"aria-pressed",
			"true",
		);
		["All", "City", "Sport"].forEach((cat) =>
			expect(screen.getByRole("button", {name: cat})).toHaveAttribute(
				"aria-pressed",
				"false",
			),
		);
	});
});
