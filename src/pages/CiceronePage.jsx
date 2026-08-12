import { useState } from "react";
import { Box, Grid, Icon } from "@chakra-ui/react";
import { FaGear } from "react-icons/fa6";
import BackgroundTiles from "../components/BackgroundTiles/BackgroundTiles.jsx";
import CheatSheet from "../components/CheatSheet/CheatSheet.jsx";
import Settings from "../components/Settings/Settings.jsx";
import Trainer from "../components/Trainer/Trainer.jsx";
import {
  KEY_STUDY_FIELDS,
  DEFAULT_STUDY_FIELDS,
  STUDY_FIELDS_MAP,
  KEY_BEERS,
  DEFAULT_BEERS,
  BEERS_MAP,
} from "../lib/constants.js";
import { useKeyPress } from "../hooks/useKeyPress.js";
import { useLocalStorageSafeArray } from "../hooks/useLocalStorageSafeArray.js";
import { getRandomItem } from "../lib/utils.js";

export default function CiceronePage() {
  const [studyFields] = useLocalStorageSafeArray(KEY_STUDY_FIELDS, DEFAULT_STUDY_FIELDS, true);
  const [beers] = useLocalStorageSafeArray(KEY_BEERS, DEFAULT_BEERS, true);
  const [module, setModule] = useState("trainer"); // "trainer", "cheatsheet", "settings"

  const [gameState, setGameState] = useState(() => ({
    beer: getRandomItem(beers),
    studyField: getRandomItem(studyFields),
    showSolution: false,
    history: [],
  }));

  const syncGameStateWithSettings = () => {
    setGameState((prev) => {
      const validBeer = beers.includes(prev.beer) ? prev.beer : getRandomItem(beers);
      const validField = studyFields.includes(prev.studyField) ? prev.studyField : getRandomItem(studyFields);
      const validHistory = prev.history.filter((code) => beers.includes(code));

      return {
        beer: validBeer,
        studyField: validField,
        showSolution: prev.beer === validBeer && prev.studyField === validField && prev.showSolution,
        history: validHistory,
      };
    });
  };

  const changeModule = (targetModule, toggle = false) => {
    const validToggle = toggle && targetModule === module;
    const nextModule = validToggle ? "trainer" : targetModule;

    if (module === "settings" && nextModule !== "settings") {
      syncGameStateWithSettings();
    }

    setModule(nextModule);
  };

  const isSKeyPressed = useKeyPress("KeyS", () => changeModule("settings", true));
  useKeyPress("ArrowUp", () => changeModule("cheatsheet", true), true);
  useKeyPress("Escape", () => changeModule("trainer"));

  const handleTrainerButton = () => {
    // Reveal solution.
    if (!gameState.showSolution) {
      setGameState((prev) => ({ ...prev, showSolution: true }));
      return;
    }

    // Get next study field.
    const hasMultipleStudyFields = studyFields.length > 1;
    const studyFieldsPool = studyFields.filter((field) => field !== gameState.studyField);
    const nextStudyField = hasMultipleStudyFields ? getRandomItem(studyFieldsPool) : gameState.studyField;

    // Get next beer.
    const eligibleBeers = beers.filter((beer) => !gameState.history.includes(beer) && beer !== gameState.beer);
    const isCycleComplete = eligibleBeers.length === 0;
    const nonActiveBeers = beers.filter((beer) => beer !== gameState.beer);
    const beersPool = isCycleComplete ? nonActiveBeers : eligibleBeers;
    const isSingleBeerSelected = beersPool.length === 0;
    const validBeersPool = isSingleBeerSelected ? beers : beersPool;
    const nextBeer = getRandomItem(validBeersPool);
    const shouldResetHistory = isCycleComplete || isSingleBeerSelected;
    const nextHistory = shouldResetHistory ? [] : [...gameState.history, gameState.beer];

    setGameState({
      beer: nextBeer,
      studyField: nextStudyField,
      showSolution: false,
      history: nextHistory,
    });
  };

  const beer = BEERS_MAP.get(gameState.beer);
  const studyField = STUDY_FIELDS_MAP.get(gameState.studyField);
  const solution = `${beer[gameState.studyField]}`;

  return (
    <>
      <BackgroundTiles glass={beer.glass} />
      <Grid
        position="fixed"
        top={0}
        left={0}
        w="100vw"
        h="100dvh"
        placeItems="center"
        overflowY="auto"
        p={12}
        scrollbarGutter="stable"
      >
        <Box
          position={{ base: "absolute", md: "fixed" }}
          top={0}
          left={0}
          userSelect="none"
          zIndex={10}
          cursor="pointer"
          onClick={() => changeModule("settings", true)}
          transition="transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          transform={isSKeyPressed ? "scale(1.16)" : "scale(1)"}
          color={isSKeyPressed ? "gray.500" : "gray.800"}
          _hover={{
            transform: "scale(1.16)",
            color: "gray.500",
            _active: { transform: "scale(1.08)", color: "gray.700" },
          }}
          aria-label="Toggle Settings Panel Button"
        >
          <Icon as={FaGear} boxSize={12} p={2} />
        </Box>
        <Box w="100%" display="flex" justifyContent="center">
          {module === "cheatsheet" && <CheatSheet beer={beer} onClose={() => changeModule("trainer")} />}
          {module === "settings" && <Settings onClose={() => changeModule("trainer")} />}
          {module === "trainer" && (
            <Trainer
              question={studyField.question}
              solution={solution}
              style={beer.style}
              color={studyField.color}
              showSolution={gameState.showSolution}
              onOpenCheatSheet={() => changeModule("cheatsheet")}
              handleTrainerButton={handleTrainerButton}
            />
          )}
        </Box>
      </Grid>
    </>
  );
}
