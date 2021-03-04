import styled from "styled-components"

const StyledBurger = styled.button`
    position: absolute;
    top: 40px;
    right: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 2rem;
    height: 2rem;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 10;

    &:focus {
        outline: none;
    }

    div {
        width: 2rem;
        height: 0.15rem;
        background: #b58f18;
        border-radius: 10px;
        transition: all 0.3s linear;
        position: relative;
        transform-origin: 1px;

        :first-child {
            transform: ${({ open }) => (open ? "rotate(45deg)" : "rotate(0)")};
        }

        :nth-child(2) {
            opacity: ${({ open }) => (open ? "0" : "1")};
            transform: ${({ open }) =>
                open ? "translateX(20px)" : "translateX(0)"};
        }

        :nth-child(3) {
            transform: ${({ open }) => (open ? "rotate(-45deg)" : "rotate(0)")};
        }
    }
`

const Burger = ({ menuOpen, setMenuOpen }) => {
    return (
        <StyledBurger open={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            <div />
            <div />
            <div />
        </StyledBurger>
    )
}

export default Burger
