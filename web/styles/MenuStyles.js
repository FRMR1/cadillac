import styled from "styled-components"

export const MenuStyles = styled.nav`
    display: flex;
    z-index: 5;
    flex-direction: column;
    justify-content: center;
    background: #202020;
    height: 100vh;
    text-align: left;
    padding: 2rem;
    position: fixed;
    top: 0;
    left: 0;
    transition: transform 0.3s ease-in-out;
    transform: ${({ menuOpen }) =>
        menuOpen ? "translateX(0)" : "translateX(-100%)"};
    @media (max-width: 700px) {
        width: 100%;
    }

    a {
        font-size: 3.5rem !important;
        text-transform: uppercase;
        padding: 2rem 0;
        font-weight: bold;
        letter-spacing: 0.5rem;
        color: #fff;
        text-decoration: none;
        transition: color 0.3s linear;
        font-family: "Winsor";

        @media (max-width: 700px) {
            font-size: 1.5rem;
            text-align: center;
        }

        &:hover {
            color: #b58f18;
        }
    }
`
