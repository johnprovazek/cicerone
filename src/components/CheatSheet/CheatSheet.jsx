import React from "react";
import { Box, Grid, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { FaXmark } from "react-icons/fa6";
import {
  GLASSWARE_SVG_PATHS,
  GLASSWARE_SVG_VIEWBOX_SIZE,
  FOAM_COLOR,
  OUTLINE_COLOR,
  STUDY_FIELDS,
} from "../../lib/constants";

const MOBILE_FORMAT_FIELDS = ["carbonation", "body"];

const formatField = (beer, fieldKey) => {
  const value = beer[fieldKey];

  if (!MOBILE_FORMAT_FIELDS.includes(fieldKey)) {
    return value;
  }

  const mobileText = value.includes("(") ? value.replace("(", `${fieldKey} (`) : `${value} ${fieldKey}`;

  return (
    <>
      <Box as="span" display={{ base: "inline", md: "none" }}>
        {mobileText}
      </Box>
      <Box as="span" display={{ base: "none", md: "inline" }}>
        {value}
      </Box>
    </>
  );
};

export default function CheatSheet({ beer, onClose }) {
  const { beer: beerPath, foam: foamPath, outline: outlinePath } = GLASSWARE_SVG_PATHS[beer.glass];

  return (
    <VStack
      w="100%"
      h="auto"
      maxW="xl"
      gap={0}
      bg="white"
      borderRadius="2xl"
      boxShadow="xl"
      position="relative"
      p={{ base: 6, md: 12 }}
      userSelect="none"
    >
      <Box
        position="absolute"
        top={4}
        right={4}
        cursor="pointer"
        onClick={onClose}
        transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
        transformOrigin="center"
        willChange="transform"
        color="gray.800"
        _hover={{ transform: "scale(1.16)", color: "gray.500" }}
      >
        <Icon as={FaXmark} boxSize={6} />
      </Box>

      <Text
        fontSize={{ base: "2xl", md: "4xl" }}
        fontWeight="bold"
        color="gray.800"
        textAlign="center"
        mb={{ base: 4, md: 8 }}
      >
        {beer.style}
      </Text>

      <Box
        boxSize={{ base: 32, md: 48 }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={{ base: 4, md: 8 }}
      >
        <svg width="100%" height="100%" viewBox={`0 0 ${GLASSWARE_SVG_VIEWBOX_SIZE} ${GLASSWARE_SVG_VIEWBOX_SIZE}`}>
          <path d={beerPath} fill={beer.hex} />
          <path d={foamPath} fill={FOAM_COLOR} />
          <path d={outlinePath} fill={OUTLINE_COLOR} />
        </svg>
      </Box>

      <VStack width="100%" gap={0} borderRadius="2xl" overflow="hidden" boxShadow="md">
        {STUDY_FIELDS.map((field, index) => (
          <Grid
            key={field.key}
            templateColumns={{ base: "auto minmax(0, 1fr)", md: "10rem minmax(0, 1fr)" }}
            gap={4}
            width="100%"
            alignItems="center"
            px={6}
            py={4}
            bg={index % 2 === 0 ? "gray.50" : "gray.100"}
          >
            <HStack alignSelf="center" gap={2}>
              <Icon as={field.icon} boxSize={5} color={field.color} />
              <Text fontSize="md" fontWeight="bold" color={field.color} display={{ base: "none", md: "inline" }}>
                {field.label}:
              </Text>
            </HStack>
            <Text fontSize={{ base: "sm", md: "md" }} fontWeight="medium" color="gray.700" wordBreak="break-word">
              {formatField(beer, field.key)}
            </Text>
          </Grid>
        ))}
      </VStack>
    </VStack>
  );
}
