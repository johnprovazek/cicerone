import { Box, Text, Button } from "@chakra-ui/react";
import { useKeyPress } from "../../hooks/useKeyPress.js";

export default function Trainer({
  question,
  solution,
  color,
  style,
  showSolution,
  onOpenCheatSheet,
  handleTrainerButton,
}) {
  const isRightArrowKeyPressed = useKeyPress("ArrowRight", handleTrainerButton, true);
  const [prefix = "", highlight = "", suffix = ""] = question.split("*");

  return (
    <Box w="100%" display="flex" flexDirection="column" alignItems="center">
      <Box
        maxW="100%"
        mb={{ base: 3, md: 6 }}
        display="flex"
        alignItems="flex-end"
        justifyContent="center"
        textAlign="center"
        userSelect="none"
        h={{ base: 24, md: 32 }}
      >
        <Text color="gray.800" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="medium">
          {prefix}
          <Box as="span" color={color} fontWeight="black" mx={1}>
            {highlight}
          </Box>
          {suffix}{" "}
          <Box as="span" whiteSpace="nowrap">
            <Box
              as="span"
              fontWeight="bold"
              fontStyle="italic"
              pb="0.2rem"
              cursor="pointer"
              backgroundImage="linear-gradient(var(--chakra-colors-gray-800), var(--chakra-colors-gray-800));"
              backgroundSize="1rem 0.2rem"
              backgroundRepeat="repeat-x"
              backgroundPosition="0 100%"
              _hover={{
                backgroundImage: "linear-gradient(90deg, var(--chakra-colors-gray-800) 50%, transparent 50%)",
                animation: `marchingAnts 0.4s linear infinite`,
                animationDelay: "100ms",
              }}
              onClick={onOpenCheatSheet}
            >
              {style}
            </Box>
            {" ?"}
          </Box>
        </Text>
      </Box>
      <Box
        w="100%"
        minH={{ base: 72, md: 96 }}
        maxW="xl"
        my={{ base: 3, md: 6 }}
        px={4}
        bg="gray.100"
        borderRadius="xl"
        boxShadow="inner"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {showSolution && (
          <Text
            color={color}
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="black"
            letterSpacing="tight"
            textAlign="center"
            lineHeight="shorter"
          >
            {solution}
          </Text>
        )}
      </Box>
      <Button
        w="100%"
        minH={{ base: 12, md: 16 }}
        maxW="xl"
        mt={{ base: 3, md: 6 }}
        fontSize={{ base: "md", md: "xl" }}
        borderRadius="xl"
        onClick={handleTrainerButton}
        transform={isRightArrowKeyPressed ? "scale(1.03)" : "scale(1)"}
        bg={isRightArrowKeyPressed ? "gray.700" : "gray.800"}
        color="white"
        _hover={{
          transform: "scale(1.03)",
          bg: "gray.500",
          _active: {
            transform: "scale(1)",
            bg: "gray.700",
          },
        }}
      >
        {showSolution ? "Next Question" : "Reveal Solution"}
      </Button>
    </Box>
  );
}
