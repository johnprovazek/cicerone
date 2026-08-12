import { useState, useEffect } from "react";
import { Accordion, Box, Checkbox, HStack, Icon, Image, Text, VStack } from "@chakra-ui/react";
import escKeyIcon from "../../assets/images/keys/esc.svg";
import rightKeyIcon from "../../assets/images/keys/right.svg";
import sKeyIcon from "../../assets/images/keys/s.svg";
import upKeyIcon from "../../assets/images/keys/up.svg";
import {
  FaChevronDown,
  FaCircle,
  FaRegSquare,
  FaRegSquareCheck,
  FaSquareCheck,
  FaSquareMinus,
  FaToggleOff,
  FaToggleOn,
  FaXmark,
} from "react-icons/fa6";
import {
  KEY_OPEN_SETTINGS_SECTIONS,
  DEFAULT_OPEN_SETTINGS_SECTIONS,
  KEY_SHOW_TILES_BACKGROUND,
  DEFAULT_SHOW_TILES_BACKGROUND,
  KEY_STUDY_FIELDS,
  STUDY_FIELDS,
  DEFAULT_STUDY_FIELDS,
  KEY_BEERS,
  BEERS,
  DEFAULT_BEERS,
} from "../../lib/constants.js";
import { useIsMobileDevice } from "../../hooks/useIsMobileDevice.js";
import { useLocalStorageSafeArray } from "../../hooks/useLocalStorageSafeArray.js";
import { useLocalStorage } from "@uidotdev/usehooks";

const SETTINGS_SECTIONS = ["Study Fields", "Beers", "Keyboard Controls", "Design"];
const INIT_VISIBLE_CHECKBOXES_COUNT = 8;

const KEYBOARD_CONTROLS = [
  { label: "Reveal / Next", icon: rightKeyIcon },
  { label: "Cheat Sheet", icon: upKeyIcon },
  { label: "Settings", icon: sKeyIcon },
  { label: "Close", icon: escKeyIcon },
];

const NORMALIZED_STUDY_FIELDS = STUDY_FIELDS.map((field) => ({
  id: field.key,
  label: field.label,
  labelIcon: field.icon,
  labelIconColor: field.color,
  textColor: field.color,
}));

const NORMALIZED_BEERS = BEERS.map((beer) => ({
  id: beer.key,
  label: beer.style,
  labelIcon: FaCircle,
  labelIconColor: beer.hex,
  textColor: "gray.700",
}));

// Settings section wrapper to handle accordion item styling and open/close state.
function SettingsSectionWrapper({ section, isOpen, prevIsOpen, nextIsOpen, isFirst, isLast, children }) {
  return (
    <Accordion.Item
      value={section}
      mt={!isFirst && (isOpen || prevIsOpen) ? 8 : 0}
      borderTopRadius={isOpen || isFirst || prevIsOpen ? "2xl" : "none"}
      borderBottomRadius={isOpen || isLast || nextIsOpen ? "2xl" : "none"}
      borderBottomWidth={!isOpen && !nextIsOpen && !isLast ? 1 : 0}
      borderBottomStyle="solid"
      borderColor="gray.200"
      bg="gray.50"
      boxShadow="md"
      overflow="hidden"
    >
      <HStack justifyContent="space-between" w="100%" p={6} bg="gray.50">
        <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" letterSpacing="tight" color="gray.800">
          {section}
        </Text>
        <Accordion.ItemTrigger
          boxSize={10}
          cursor="pointer"
          _hover={{
            "& svg": {
              transform: "scale(1.16)",
              color: "gray.500",
            },
          }}
        >
          <Accordion.ItemIndicator display="flex" alignItems="center" justifyContent="center" boxSize="100%">
            <Icon as={FaChevronDown} boxSize={6} color="gray.800" transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)" />
          </Accordion.ItemIndicator>
        </Accordion.ItemTrigger>
      </HStack>
      {children}
    </Accordion.Item>
  );
}

// Settings section for study fields and beers.
function CheckboxSection({ items, selectedIds, setSelectedIds, defaultSelectedIds }) {
  const [visibleCount, setVisibleCount] = useState(INIT_VISIBLE_CHECKBOXES_COUNT);

  const selectedSet = new Set(selectedIds);
  const selectedCount = selectedIds.length;
  const isNoneSelected = selectedCount === 0;
  const allSelected = selectedCount === items.length;
  const someSelected = selectedCount > 0 && !allSelected;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(defaultSelectedIds);
    }
  };

  const handleToggle = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const selectAllIcon = allSelected ? FaSquareCheck : someSelected ? FaSquareMinus : FaRegSquare;

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setVisibleCount(items.length);
    });
    return () => cancelAnimationFrame(handle);
  }, [items.length]);

  const visibleItems = items.slice(0, visibleCount);

  return (
    <Accordion.ItemContent p={0} bg="gray.100">
      <Box
        h={{ base: "29.8125rem", md: "25.5rem" }}
        overflowY="auto"
        overflowX="hidden"
        scrollbarGutter="stable"
        position="relative"
        willChange="scroll-position"
      >
        <Box
          position="sticky"
          top={0}
          zIndex={10}
          bg="gray.100"
          px={6}
          pt={6}
          _after={{
            content: '""',
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            h: 2,
            bgGradient: "to-b",
            gradientFrom: "gray.100",
            gradientTo: "transparent",
            pointerEvents: "none",
          }}
        >
          <Box
            pb={{ base: 1, md: 0 }}
            borderBottomWidth={{ base: 1, md: 0 }}
            borderBottomStyle="solid"
            borderColor="gray.300"
          >
            <HStack h={10} w="100%" gap={3} justifyContent="flex-start">
              <Checkbox.Root checked={allSelected} onCheckedChange={handleSelectAll} overflow="visible">
                <Checkbox.HiddenInput />
                <Checkbox.Control
                  bg="transparent"
                  border="none"
                  boxShadow="none"
                  p={0}
                  w="auto"
                  h="auto"
                  cursor="pointer"
                >
                  <Icon
                    as={selectAllIcon}
                    boxSize={6}
                    color="gray.700"
                    _hover={{
                      transform: "scale(1.16)",
                      color: "gray.500",
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                </Checkbox.Control>
              </Checkbox.Root>
              <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" color="gray.700" whiteSpace="nowrap">
                Select All
              </Text>
            </HStack>
          </Box>
        </Box>
        <Box w="100%" px={6}>
          <Box flex={1} w="100%" pl={{ base: 0, md: 8 }}>
            <VStack align="start" gap={0} w="100%">
              {visibleItems.map((item) => {
                const isSelected = selectedSet.has(item.id);
                const checkboxIcon = isNoneSelected ? FaRegSquareCheck : isSelected ? FaSquareCheck : FaRegSquare;
                return (
                  <HStack key={item.id} minH={{ base: 12, md: 10 }} w="100%" gap={3} justifyContent="flex-start">
                    <Checkbox.Root
                      checked={isSelected}
                      onCheckedChange={() => handleToggle(item.id)}
                      overflow="visible"
                      flexShrink={0}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control
                        bg="transparent"
                        border="none"
                        boxShadow="none"
                        p={0}
                        w="auto"
                        h="auto"
                        cursor="pointer"
                      >
                        <Icon
                          as={checkboxIcon}
                          boxSize={6}
                          color="gray.700"
                          _hover={{
                            transform: "scale(1.16)",
                            color: "gray.500",
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        />
                      </Checkbox.Control>
                    </Checkbox.Root>
                    <Icon as={item.labelIcon} boxSize={6} color={item.labelIconColor} flexShrink={0} />
                    <Text
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight="medium"
                      color={item.textColor}
                      whiteSpace="normal"
                      lineHeight="short"
                    >
                      {item.label}
                    </Text>
                  </HStack>
                );
              })}
            </VStack>
          </Box>
        </Box>
        <Box
          position="sticky"
          bottom={0}
          zIndex={10}
          bg="gray.100"
          w="100%"
          pb={6}
          pointerEvents="none"
          _before={{
            content: '""',
            position: "absolute",
            bottom: "100%",
            left: 0,
            right: 0,
            h: 2,
            bgGradient: "to-t",
            gradientFrom: "gray.100",
            gradientTo: "transparent",
            pointerEvents: "none",
          }}
        />
      </Box>
    </Accordion.ItemContent>
  );
}

// Settings section for keyboard controls and design.
function ListSection({ items }) {
  return (
    <Accordion.ItemContent p={6} bg="gray.100">
      <VStack gap={4} w="100%" align="stretch">
        {items.map((item) => {
          const isToggle = typeof item.onClick === "function";
          return (
            <HStack key={item.label} justifyContent="space-between" w="100%">
              <Text fontSize={{ base: "sm", md: "md" }} fontWeight="medium" color="gray.700" whiteSpace="nowrap">
                {item.label}
              </Text>
              <Box
                cursor={isToggle ? "pointer" : "default"}
                onClick={isToggle ? item.onClick : undefined}
                _hover={
                  isToggle
                    ? { transform: "scale(1.16)", transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)" }
                    : undefined
                }
              >
                {typeof item.icon === "string" ? (
                  <Image src={item.icon} alt={item.label} boxSize={10} />
                ) : (
                  <Icon as={item.icon} boxSize={10} color="gray.700" />
                )}
              </Box>
            </HStack>
          );
        })}
      </VStack>
    </Accordion.ItemContent>
  );
}

export default function Settings({ onClose }) {
  const [studyFields, setStudyFields] = useLocalStorageSafeArray(KEY_STUDY_FIELDS, DEFAULT_STUDY_FIELDS, false);
  const [beers, setBeers] = useLocalStorageSafeArray(KEY_BEERS, DEFAULT_BEERS, false);
  const isMobile = useIsMobileDevice();

  const [openSettingsSections, setOpenSettingsSections] = useLocalStorage(
    KEY_OPEN_SETTINGS_SECTIONS,
    DEFAULT_OPEN_SETTINGS_SECTIONS,
  );
  const [showBackground, setShowBackground] = useLocalStorage(KEY_SHOW_TILES_BACKGROUND, DEFAULT_SHOW_TILES_BACKGROUND);

  const sections = isMobile ? SETTINGS_SECTIONS.filter((s) => s !== "Keyboard Controls") : SETTINGS_SECTIONS;
  const openSet = new Set(openSettingsSections);

  const handleAccordionChange = (details) => {
    setOpenSettingsSections(details.value || []);
  };

  const designItems = [
    {
      label: "Background",
      icon: showBackground ? FaToggleOn : FaToggleOff,
      onClick: () => setShowBackground((prev) => !prev),
    },
  ];

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
        mb={{ base: 6, md: 8 }}
      >
        Settings
      </Text>
      <Box w="100%">
        <Accordion.Root
          lazyMount
          unmountOnExit={false}
          multiple
          value={openSettingsSections}
          onValueChange={handleAccordionChange}
        >
          {sections.map((section, index) => {
            const isOpen = openSet.has(section);
            const prevIsOpen = index > 0 && openSet.has(sections[index - 1]);
            const nextIsOpen = index < sections.length - 1 && openSet.has(sections[index + 1]);
            const isFirst = index === 0;
            const isLast = index === sections.length - 1;

            return (
              <SettingsSectionWrapper
                key={section}
                section={section}
                isOpen={isOpen}
                prevIsOpen={prevIsOpen}
                nextIsOpen={nextIsOpen}
                isFirst={isFirst}
                isLast={isLast}
              >
                {section === "Study Fields" && (
                  <CheckboxSection
                    items={NORMALIZED_STUDY_FIELDS}
                    selectedIds={studyFields}
                    setSelectedIds={setStudyFields}
                    defaultSelectedIds={DEFAULT_STUDY_FIELDS}
                  />
                )}
                {section === "Beers" && (
                  <CheckboxSection
                    items={NORMALIZED_BEERS}
                    selectedIds={beers}
                    setSelectedIds={setBeers}
                    defaultSelectedIds={DEFAULT_BEERS}
                  />
                )}
                {section === "Keyboard Controls" && <ListSection items={KEYBOARD_CONTROLS} />}
                {section === "Design" && <ListSection items={designItems} />}
              </SettingsSectionWrapper>
            );
          })}
        </Accordion.Root>
      </Box>
    </VStack>
  );
}
