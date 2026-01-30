import React from "react";
import Head from "next/head";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  LinearProgress,
  TextField,
  MenuItem,
  Select,
  IconButton,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Add,
  CalendarMonth,
  AccessTime,
  AutoAwesome,
} from "@mui/icons-material";

/* ---------- SHARED STYLES ---------- */

const bg = "#0b0b0b";
const cardBg = "#121212";
const border = "#1f1f1f";
const orange = "#ff7a00";

const cardStyle = {
  background: cardBg,
  border: `1px solid ${border}`,
  borderRadius: 14,
  padding: "18px",
};

/* ---------- PAGE ---------- */

export default function LeavePage() {
  return (
    <>
      <Head>
        <title>Leave Management</title>
      </Head>

      <Box sx={{ minHeight: "100vh", background: bg, color: "#fff" }}>
        {/* NAVBAR */}
        <AppBar elevation={0} sx={{ background: "#0e0e0e", borderBottom: `1px solid ${border}` }}>
          <Container maxWidth="xl">
            <Box sx={{ display: "flex", alignItems: "center", height: 64 }}>
              <Typography sx={{ fontWeight: 700 }}>
                <span style={{ color: orange }}>ZenX</span> Connect
              </Typography>

              <Box sx={{ ml: "auto", display: "flex", gap: 3, alignItems: "center" }}>
                <Typography>Dashboard</Typography>
                <Typography sx={{ color: orange }}>Leave Management</Typography>
                <Typography>Payroll</Typography>
                <Typography>AI Assistant</Typography>
                <Avatar sx={{ bgcolor: orange, width: 34, height: 34 }}>JD</Avatar>
              </Box>
            </Box>
          </Container>
        </AppBar>

        <Container maxWidth="xl" sx={{ pt: 10, pb: 6 }}>
          {/* HEADER */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Leave Management
              </Typography>
              <Typography sx={{ color: "#9e9e9e", fontSize: 14 }}>
                Track your balances, peer availability, and manage requests.
              </Typography>
            </Box>

            <Button
              startIcon={<Add />}
              sx={{
                background: orange,
                color: "#fff",
                px: 3,
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": { background: "#ff8c1a" },
              }}
            >
              Apply for Leave
            </Button>
          </Box>

          {/* LEAVE BALANCES */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: "ANNUAL", value: "12", used: "8 of 20 days", color: "#4da3ff" },
              { label: "SICK", value: "06", used: "2 of 8 days", color: "#35c96f" },
              { label: "CASUAL", value: "04", used: "6 of 10 days", color: "#b36bff" },
            ].map((c) => (
              <Grid item xs={12} md={4} key={c.label}>
                <Paper sx={cardStyle}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 2,
                        background: `${c.color}22`,
                      }}
                    />
                    <Typography sx={{ fontSize: 11, letterSpacing: 1, color: "#aaa" }}>
                      {c.label}
                    </Typography>
                  </Box>

                  <Typography sx={{ fontSize: 32, fontWeight: 700 }}>{c.value}</Typography>
                  <Typography sx={{ fontSize: 13, color: "#aaa", mb: 1 }}>
                    Days remaining
                  </Typography>

                  <LinearProgress
                    variant="determinate"
                    value={65}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      background: "#1d1d1d",
                      mb: 1,
                      "& .MuiLinearProgress-bar": {
                        background: c.color,
                      },
                    }}
                  />

                  <Typography sx={{ fontSize: 12, color: "#888" }}>
                    Used: {c.used}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* MAIN GRID */}
          <Grid container spacing={2}>
            {/* LEFT */}
            <Grid item xs={12} lg={8}>
              {/* QUICK APPLY */}
              <Paper sx={{ ...cardStyle, mb: 2 }}>
                <Typography sx={{ fontWeight: 600, mb: 2 }}>⚡ Quick Apply</Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography sx={{ fontSize: 12, color: "#aaa", mb: 0.5 }}>
                      Leave Type
                    </Typography>
                    <Select fullWidth size="small" defaultValue="Earned Leave">
                      <MenuItem value="Earned Leave">Earned Leave</MenuItem>
                    </Select>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <Typography sx={{ fontSize: 12, color: "#aaa", mb: 0.5 }}>
                      Duration
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <TextField size="small" placeholder="mm/dd/yyyy" fullWidth />
                      <TextField size="small" placeholder="mm/dd/yyyy" fullWidth />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography sx={{ fontSize: 12, color: "#aaa", mb: 0.5 }}>
                      Reason for Leave
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Briefly describe the reason..."
                    />
                  </Grid>

                  <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      sx={{
                        background: orange,
                        color: "#fff",
                        px: 4,
                        borderRadius: 2,
                        fontWeight: 600,
                      }}
                    >
                      Submit Request
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              {/* TEAM AVAILABILITY */}
              <Paper sx={cardStyle}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CalendarMonth sx={{ color: orange, mr: 1 }} />
                  <Typography sx={{ fontWeight: 600 }}>Team Availability</Typography>
                  <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
                    <IconButton size="small"><ChevronLeft /></IconButton>
                    <Typography sx={{ mx: 1, fontSize: 14 }}>October 2023</Typography>
                    <IconButton size="small"><ChevronRight /></IconButton>
                  </Box>
                </Box>

                {["Sarah Miller", "Ryan K.", "Amy Lee"].map((name) => (
                  <Box
                    key={name}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Avatar sx={{ width: 28, height: 28, mr: 1.5 }}>{name[0]}</Avatar>
                    <Typography sx={{ width: 140 }}>{name}</Typography>
                    {[1, 2, 3, 4, 5].map((d) => (
                      <Box
                        key={d}
                        sx={{
                          width: 26,
                          height: 6,
                          borderRadius: 2,
                          mx: 0.5,
                          background:
                            d === 3 ? "#e67e22" : "#35c96f",
                        }}
                      />
                    ))}
                  </Box>
                ))}
              </Paper>
            </Grid>

            {/* RIGHT */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                {/* RECENT REQUESTS */}
                <Paper sx={{ ...cardStyle, mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AccessTime sx={{ color: orange, mr: 1 }} />
                    <Typography sx={{ fontWeight: 600 }}>Recent Requests</Typography>
                  </Box>

                  <Typography sx={{ fontSize: 12, color: "#f5a623" }}>
                    PENDING
                  </Typography>
                  <Typography sx={{ fontSize: 14 }}>Earned Leave</Typography>
                  <Typography sx={{ fontSize: 12, color: "#aaa", mb: 2 }}>
                    Oct 25 - Oct 27 (3 Days)
                  </Typography>

                  <Typography sx={{ fontSize: 12, color: "#35c96f" }}>
                    APPROVED
                  </Typography>
                  <Typography sx={{ fontSize: 14 }}>Casual Leave</Typography>
                </Paper>

                {/* AI INSIGHT */}
                <Paper
                  sx={{
                    background: orange,
                    borderRadius: 14,
                    padding: 2,
                    mt: "auto",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <AutoAwesome sx={{ mr: 1 }} />
                    <Typography sx={{ fontWeight: 700 }}>AI Insight</Typography>
                  </Box>

                  <Typography sx={{ fontSize: 13, mb: 2 }}>
                    Based on your team’s schedule, October 24th is the best day
                    for your team outing. No one has leaves planned yet!
                  </Typography>

                  <Button
                    fullWidth
                    sx={{
                      background: "rgba(255,255,255,0.25)",
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  >
                    Schedule Sync
                  </Button>
                </Paper>
              </Box>
            </Grid>
          </Grid>

          {/* FOOTER */}
          <Box sx={{ textAlign: "center", mt: 6, pt: 3, borderTop: `1px solid ${border}` }}>
            <Typography sx={{ fontSize: 12, color: "#777" }}>
              © 2023 ZenX Connect – AI Powered Enterprise Suite
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}
