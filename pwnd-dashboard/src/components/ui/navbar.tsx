"use client";
import { useState } from "react";
import { Box, Flex, Stack, IconButton, Link, Text } from "@chakra-ui/react";
import { MdMenu as HamburgerIcon, MdClose as CloseIcon } from "react-icons/md";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Flex
      as="nav"
      position="fixed" // Stick it to the top
      top="0"
      left="0"
      w="100vw" // Full width
      maxW="100%" // Ensure no shrinking
      bg="gray.900"
      color="white"
      p={4}
      align="center"
      justify="space-between"
      zIndex="1000" // Keep it above everything
    >
      <Link href="/">
        <Box fontSize="xl" fontWeight="bold" color="white">
          leakd
        </Box>
      </Link>

      {/* Desktop Menu */}
      <Stack direction="row" gap={8} display={{ base: "none", md: "flex" }}>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/why">Why?</NavLink>
        <NavLink href="/about">About</NavLink>
      </Stack>

      {/* Mobile Menu Button */}
      <IconButton
        aria-label="Open menu"
        display={{ base: "flex", md: "none" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <CloseIcon color="black" /> : <HamburgerIcon color="black" />}
      </IconButton>

      {/* Mobile Menu */}
      {isOpen && (
        <Stack
          direction="column"
          bg="gray.900"
          color="white"
          position="absolute"
          top="60px"
          left="0"
          width="100%"
          p={4}
          gap={4}
          boxShadow="lg"
          zIndex="100"
        >
          <NavLink href="/" onClick={() => setIsOpen(false)}>
            Home
          </NavLink>
          <NavLink href="/why" onClick={() => setIsOpen(false)}>
            Why?
          </NavLink>
          <NavLink href="/about" onClick={() => setIsOpen(false)}>
            About
          </NavLink>
        </Stack>
      )}
    </Flex>
  );
}

// NavLink Component
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick }) => (
  <Link href={href} onClick={onClick}>
    <Text color="white">{children}</Text>
  </Link>
);
