import { useEffect, useMemo, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {
    getSettings,
    saveSettings,
} from "../services/settingsService";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import SaveIcon from "@mui/icons-material/Save";
import StraightenIcon from "@mui/icons-material/Straighten";

const DEFAULT_SETTINGS = {
    height: 172,
    startingWeight: 95,
    goalWeight: 58,
    dailyStepGoal: 10000,
};

const iconTileSx = {
    width: 40,
    height: 40,
    borderRadius: 2,
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
};

function SummaryItem({
    icon,
    label,
    value,
    color = "#16A34A",
    background = "#ECFDF3",
}) {
    return (
        <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
                sx={{
                    ...iconTileSx,
                    color,
                    backgroundColor: background,
                }}
            >
                {icon}
            </Box>

            <Box>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={800}
                >
                    {label}
                </Typography>

                <Typography variant="h6" fontWeight={900}>
                    {value}
                </Typography>
            </Box>
        </Stack>
    );
}

export default function Settings() {
    const [settings, setSettings] =
        useState(DEFAULT_SETTINGS);

    const [saved, setSaved] =
        useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const existing = await getSettings();

                if (existing) {
                    setSettings({
                        ...DEFAULT_SETTINGS,
                        height:
                            existing.height ??
                            DEFAULT_SETTINGS.height,
                        startingWeight:
                            existing.starting_weight ??
                            DEFAULT_SETTINGS.startingWeight,
                        goalWeight:
                            existing.goal_weight ??
                            DEFAULT_SETTINGS.goalWeight,
                        dailyStepGoal:
                            existing.daily_step_goal ??
                            DEFAULT_SETTINGS.dailyStepGoal,
                    });
                }
            } catch (error) {
                console.error(
                    "Failed to load settings:",
                    error
                );
            }
        };

        loadSettings();
    }, []);

    const targetLoss = useMemo(
        () =>
            Math.max(
                0,
                settings.startingWeight -
                settings.goalWeight
            ),
        [
            settings.startingWeight,
            settings.goalWeight,
        ]
    );

    const updateSetting =
        (key) => (event) => {
            setSettings({
                ...settings,
                [key]: Number(event.target.value),
            });
        };

    const handleSave = async () => {
        try {
            await saveSettings(settings);
            setSaved(true);
        } catch (error) {
            console.error("Failed to save settings:", error);
        }
    };

    return (
        <>
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="overline"
                    color="primary.main"
                    fontWeight={900}
                >
                    SETTINGS
                </Typography>

                <Typography
                    variant="h3"
                    fontWeight={900}
                    sx={{
                        mb: 1,
                        fontSize: {
                            xs: "2rem",
                            md: "3rem",
                        },
                    }}
                >
                    ⚙️ Fitness Profile
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{
                        maxWidth: 700,
                        fontSize: "1rem",
                    }}
                >
                    Configure your fitness goals,
                    weight targets and daily step
                    objectives. These values power
                    your dashboard insights, BMI,
                    progress tracking and motivation
                    engine.
                </Typography>
            </Box>

            {/* SIDE BY SIDE CARDS */}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        lg: "320px 1fr",
                    },
                    gap: 2,
                }}
            >
                {/* LEFT CARD */}

                <Card
                    sx={{
                        borderRadius: 6,
                        boxShadow:
                            "0 10px 25px rgba(0,0,0,0.06)",
                        background:
                            "linear-gradient(135deg,#F0FDF4,#FFFFFF)",
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="h6"
                            fontWeight={900}
                            mb={2}
                        >
                            Profile Summary
                        </Typography>

                        <Stack spacing={3}>
                            <SummaryItem
                                icon={<StraightenIcon />}
                                label="Height"
                                value={`${settings.height} cm`}
                            />

                            <SummaryItem
                                icon={<MonitorWeightIcon />}
                                label="Target Loss"
                                value={`${targetLoss} kg`}
                                color="#2563EB"
                                background="#EFF6FF"
                            />

                            <SummaryItem
                                icon={<DirectionsWalkIcon />}
                                label="Daily Goal"
                                value={settings.dailyStepGoal.toLocaleString()}
                                color="#D97706"
                                background="#FFFBEB"
                            />
                        </Stack>
                    </CardContent>
                </Card>

                {/* RIGHT CARD */}

                <Card
                    sx={{
                        borderRadius: 6,
                        boxShadow:
                            "0 10px 25px rgba(0,0,0,0.06)",
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="h6"
                            fontWeight={900}
                            mb={3}
                        >
                            Goal Settings
                        </Typography>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "1fr 1fr",
                                },
                                gap: 3,
                            }}
                        >
                            <TextField
                                label="Height (cm)"
                                type="number"
                                value={settings.height}
                                onChange={updateSetting(
                                    "height"
                                )}
                                fullWidth
                            />

                            <TextField
                                label="Daily Step Goal"
                                type="number"
                                value={
                                    settings.dailyStepGoal
                                }
                                onChange={updateSetting(
                                    "dailyStepGoal"
                                )}
                                fullWidth
                            />

                            <TextField
                                label="Starting Weight (kg)"
                                type="number"
                                value={
                                    settings.startingWeight
                                }
                                onChange={updateSetting(
                                    "startingWeight"
                                )}
                                fullWidth
                            />

                            <TextField
                                label="Goal Weight (kg)"
                                type="number"
                                value={
                                    settings.goalWeight
                                }
                                onChange={updateSetting(
                                    "goalWeight"
                                )}
                                fullWidth
                            />
                        </Box>

                        <Box
                            sx={{
                                mt: 3,
                                p: 2,
                                borderRadius: 3,
                                backgroundColor:
                                    "#F8FAFC",
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                            >
                                <Box
                                    sx={{
                                        ...iconTileSx,
                                        color: "#16A34A",
                                        backgroundColor:
                                            "#ECFDF3",
                                    }}
                                >
                                    <FitnessCenterIcon />
                                </Box>

                                <Box flex={1}>
                                    <Typography
                                        fontWeight={900}
                                    >
                                        Goal Plan
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                    >
                                        Lose {targetLoss} kg to
                                        reach your target.
                                    </Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSave}
                                    sx={{
                                        height: 48,
                                        minWidth: 180,
                                        borderRadius: 3,
                                        fontWeight: 700,
                                        boxShadow:
                                            "0 8px 20px rgba(34,197,94,0.25)",
                                    }}
                                >
                                    Save Changes
                                </Button>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            <Snackbar
                open={saved}
                autoHideDuration={2500}
                onClose={() =>
                    setSaved(false)
                }
            >
                <Alert
                    severity="success"
                    icon={<CheckCircleIcon />}
                    onClose={() =>
                        setSaved(false)
                    }
                >
                    Settings saved successfully
                </Alert>
            </Snackbar>
        </>
    );
}