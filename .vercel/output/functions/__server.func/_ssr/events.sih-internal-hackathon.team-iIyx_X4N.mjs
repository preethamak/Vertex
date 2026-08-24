import { i as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { l as updateHackathonTeam, r as getHackathonTeam, s as saveHackathonSubmission, u as uploadHackathonDeck } from "./hackathon.functions-DcMTSn9O.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Send, f as Check, l as KeyRound, o as Save, r as Users, v as ArrowLeft } from "../_libs/lucide-react.mjs";
import { n as SiteHeader, t as SiteFooter } from "./SiteChrome-B2ymMPIS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/events.sih-internal-hackathon.team-iIyx_X4N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TeamConsole() {
	const loadTeam = useServerFn(getHackathonTeam);
	const [token, setToken] = (0, import_react.useState)("");
	const [teamData, setTeamData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setToken(sessionStorage.getItem("vertex-sih-team-key") ?? ""), []);
	const open = async () => {
		if (!token.trim()) return toast.error("Enter the private team key from registration.");
		setLoading(true);
		try {
			const data = await loadTeam({ data: { token: token.trim() } });
			sessionStorage.setItem("vertex-sih-team-key", token.trim());
			setTeamData(data);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Team key not recognised.");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-6 py-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/events/sih-internal-hackathon",
					className: "inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 14 }), " SIH workspace"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 grid gap-8 lg:grid-cols-[320px_1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "glass-panel h-fit rounded-2xl p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, {
								className: "text-silver",
								size: 21
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-4 font-display text-3xl",
								children: "Team console"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-6 text-muted-foreground",
								children: "This key controls your roster and submission. It is different from the event-day QR."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-6 flex flex-col gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
									children: "Team key"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: token,
									onChange: (event) => setToken(event.target.value),
									className: "field-input rounded-lg px-3 py-2.5 font-mono text-sm",
									autoComplete: "off"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: open,
								disabled: loading,
								className: "btn-primary mt-4 w-full justify-center rounded-lg px-4 py-3 font-mono text-[10px] uppercase tracking-widest disabled:opacity-50",
								children: loading ? "Opening…" : "Open team workspace"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { children: teamData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamWorkspace, {
						data: teamData,
						token: token.trim(),
						onRefresh: open
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card rounded-2xl p-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
								className: "text-silver",
								size: 28
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 font-display text-2xl",
								children: "Your workspace stays private."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 max-w-md text-sm leading-6 text-muted-foreground",
								children: "Open it with your team key to manage your six-person roster and submission."
							})
						]
					}) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function TeamWorkspace({ data, token, onRefresh }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card rounded-2xl p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] uppercase tracking-[.2em] text-silver",
						children: data.team.status
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-4xl",
						children: data.team.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "mt-2 text-sm text-muted-foreground" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RosterEditor, {
				data,
				token,
				onSaved: onRefresh
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubmissionEditor, {
				data,
				token,
				onSaved: onRefresh
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityLog, { items: data.activities })
		]
	});
}
function RosterEditor({ data, token, onSaved }) {
	const update = useServerFn(updateHackathonTeam);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)(data.team.name);
	const [mentorName, setMentorName] = (0, import_react.useState)(data.team.mentorName ?? "");
	const [mentorEmail, setMentorEmail] = (0, import_react.useState)(data.team.mentorEmail ?? "");
	const [members, setMembers] = (0, import_react.useState)(() => data.members.map((member) => ({
		name: member.name,
		email: member.email,
		gender: member.gender === "female" || member.gender === "male" ? member.gender : "prefer_not_to_say",
		phone: member.phone ?? "",
		srn: member.srn ?? "",
		branch: member.branch ?? "",
		year: member.year ?? "",
		isLead: member.is_lead
	})));
	const change = (index, key, value) => {
		setMembers((current) => current.map((member, i) => i === index ? {
			...member,
			[key]: value
		} : member));
	};
	const save = async () => {
		if (members.length !== 6) return toast.error("SIH teams must have exactly six students.");
		setSaving(true);
		try {
			await update({ data: {
				token,
				name,
				mentorName,
				mentorEmail,
				members
			} });
			toast.success("Roster saved.");
			setEditing(false);
			await onSaved();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not save the roster.");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-panel rounded-2xl p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[.2em] text-silver",
				children: "Roster"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-2 font-display text-2xl",
				children: "Six students, one team."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setEditing((value) => !value),
				className: "btn-ghost rounded-lg px-3 py-2 font-mono text-[10px] uppercase tracking-widest",
				children: editing ? "Close editor" : "Edit roster"
			})]
		}), !editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid gap-3 sm:grid-cols-2",
			children: data.members.map((member) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-hairline bg-surface-2 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-lg",
					children: member.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
					children: [member.is_lead ? "Team lead" : "Member", member.srn ? ` · ${member.srn}` : ""]
				})]
			}, member.id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Team name",
							value: name,
							onChange: setName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Mentor name (optional)",
							value: mentorName,
							onChange: setMentorName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Mentor email (optional)",
							value: mentorEmail,
							onChange: setMentorEmail,
							type: "email"
						})
					]
				}),
				members.map((member, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-hairline p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-[10px] uppercase tracking-widest text-silver",
							children: ["Member ", index + 1]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "radio",
									checked: member.isLead,
									onChange: () => setMembers((current) => current.map((item, i) => ({
										...item,
										isLead: i === index
									})))
								}),
								" ",
								"Team lead"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Name",
								value: member.name,
								onChange: (value) => change(index, "name", value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Email",
								value: member.email,
								type: "email",
								onChange: (value) => change(index, "email", value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[9px] uppercase tracking-widest text-muted-foreground",
									children: "Gender (SIH eligibility)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: member.gender,
									onChange: (event) => change(index, "gender", event.target.value),
									className: "field-input rounded-lg px-3 py-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "prefer_not_to_say",
											children: "Prefer not to say"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "female",
											children: "Female"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "male",
											children: "Male"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "SRN",
								value: member.srn,
								onChange: (value) => change(index, "srn", value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Branch",
								value: member.branch,
								onChange: (value) => change(index, "branch", value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Year",
								value: member.year,
								onChange: (value) => change(index, "year", value)
							})
						]
					})]
				}, index)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: saving,
					onClick: save,
					className: "btn-primary rounded-lg px-4 py-3 font-mono text-[10px] uppercase tracking-widest disabled:opacity-50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { size: 14 }),
						" ",
						saving ? "Saving…" : "Save roster"
					]
				})
			]
		})]
	});
}
function SubmissionEditor({ data, token, onSaved }) {
	const save = useServerFn(saveHackathonSubmission);
	const uploadDeck = useServerFn(uploadHackathonDeck);
	const deckInput = (0, import_react.useRef)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [statementId, setStatementId] = (0, import_react.useState)(data.submission?.problem_statement_id ?? "");
	const [title, setTitle] = (0, import_react.useState)(data.submission?.solution_title ?? "");
	const [summary, setSummary] = (0, import_react.useState)(data.submission?.solution_summary ?? "");
	const [repositoryUrl, setRepositoryUrl] = (0, import_react.useState)(data.submission?.repository_url ?? "");
	const [demoUrl, setDemoUrl] = (0, import_react.useState)(data.submission?.demo_url ?? "");
	const [deckPath, setDeckPath] = (0, import_react.useState)(data.submission?.deck_path ?? "");
	const [deckBusy, setDeckBusy] = (0, import_react.useState)(false);
	const finalized = Boolean(data.submission?.finalized_at);
	const selected = data.problemStatements.find((statement) => statement.id === statementId);
	const submit = async (final) => {
		if (!data.workspace?.submissions_open) return toast.error("Submissions are not open yet.");
		setSaving(true);
		try {
			await save({ data: {
				token,
				problemStatementId: statementId,
				problemStatementTitle: selected?.title ?? "",
				theme: selected?.theme ?? "",
				solutionTitle: title,
				solutionSummary: summary,
				repositoryUrl,
				demoUrl,
				videoUrl: "",
				deckPath,
				submit: final
			} });
			toast.success(final ? "Final submission locked." : "Draft saved.");
			await onSaved();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not save the submission.");
		} finally {
			setSaving(false);
		}
	};
	const chooseDeck = async (file) => {
		if (file.type !== "application/pdf") return toast.error("Upload the presentation as a PDF.");
		if (file.size > 8388608) return toast.error("Keep the presentation PDF under 8 MB.");
		setDeckBusy(true);
		try {
			const buffer = new Uint8Array(await file.arrayBuffer());
			let binary = "";
			for (let index = 0; index < buffer.length; index += 32768) binary += String.fromCharCode(...buffer.subarray(index, index + 32768));
			const result = await uploadDeck({ data: {
				token,
				contentType: "application/pdf",
				base64: btoa(binary)
			} });
			setDeckPath(result.path);
			toast.success("Presentation PDF attached.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not upload the presentation.");
		} finally {
			setDeckBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-panel rounded-2xl p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[.2em] text-silver",
				children: "Submission"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-2 font-display text-2xl",
				children: finalized ? "Final submission locked" : "Build your entry."
			}),
			!data.workspace?.submissions_open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "The SIH desk has not opened submissions yet. You can review your roster above."
			}),
			data.workspace?.submissions_open && !finalized && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
							children: "Official problem statement"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: statementId,
							onChange: (event) => setStatementId(event.target.value),
							className: "field-input rounded-lg px-3 py-2.5 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Choose a verified statement"
							}), data.problemStatements.map((statement) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: statement.id,
								children: [
									statement.statement_code,
									" · ",
									statement.title
								]
							}, statement.id))]
						})]
					}),
					data.problemStatements.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-amber-200",
						children: "The SIH desk has not published verified problem statements yet."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Solution title",
						value: title,
						onChange: setTitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
							children: "Solution summary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: summary,
							onChange: (event) => setSummary(event.target.value),
							rows: 6,
							className: "field-input resize-none rounded-lg px-3 py-2.5 text-sm"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Repository URL (optional)",
							value: repositoryUrl,
							type: "url",
							onChange: setRepositoryUrl
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Demo URL (optional)",
							value: demoUrl,
							type: "url",
							onChange: setDemoUrl
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3 rounded-lg border border-hairline p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: deckInput,
								type: "file",
								accept: "application/pdf",
								className: "hidden",
								onChange: (event) => {
									const file = event.target.files?.[0];
									event.target.value = "";
									if (file) chooseDeck(file);
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: deckBusy || saving,
								onClick: () => deckInput.current?.click(),
								className: "btn-ghost rounded-lg px-4 py-2 font-mono text-[10px] uppercase tracking-widest disabled:opacity-50",
								children: deckBusy ? "Uploading PDF…" : deckPath ? "Replace presentation PDF" : "Attach presentation PDF"
							}),
							deckPath && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `/api/public/media/${deckPath}`,
								target: "_blank",
								rel: "noreferrer",
								className: "font-mono text-[10px] uppercase tracking-widest text-silver hover:text-foreground",
								children: "View attached PDF"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: saving,
							onClick: () => submit(false),
							className: "btn-ghost rounded-lg px-4 py-3 font-mono text-[10px] uppercase tracking-widest disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { size: 14 }), " Save draft"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: saving || data.problemStatements.length === 0,
							onClick: () => submit(true),
							className: "btn-primary rounded-lg px-4 py-3 font-mono text-[10px] uppercase tracking-widest disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { size: 14 }), " Final submit"]
						})]
					})
				]
			})
		]
	});
}
function ActivityLog({ items }) {
	if (!items.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card rounded-2xl p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-[10px] uppercase tracking-[.2em] text-silver",
			children: "Activity"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-5 space-y-3",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex gap-3 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					size: 14,
					className: "mt-1 shrink-0 text-silver"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.summary })]
			}, item.id))
		})]
	});
}
function Field({ label, value, onChange, type = "text" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-[9px] uppercase tracking-widest text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type,
			value,
			onChange: (event) => onChange(event.target.value),
			className: "field-input rounded-lg px-3 py-2 text-sm"
		})]
	});
}
//#endregion
export { TeamConsole as component };
