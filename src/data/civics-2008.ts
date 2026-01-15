import type { CivicsQuestion } from '../types';

// Official 2008 USCIS Civics Test Questions (100 questions)
// Source: https://www.uscis.gov/citizenship/find-study-materials-and-resources/study-for-the-test

export const CIVICS_QUESTIONS: CivicsQuestion[] = [
  // AMERICAN GOVERNMENT
  // A: Principles of American Democracy
  { id: 1, q: "What is the supreme law of the land?", a: "The Constitution", section: "Principles" },
  { id: 2, q: "What does the Constitution do?", a: "Sets up the government; Defines the government; Protects basic rights of Americans", section: "Principles" },
  { id: 3, q: "The idea of self-government is in the first three words of the Constitution. What are these words?", a: "We the People", section: "Principles" },
  { id: 4, q: "What is an amendment?", a: "A change (to the Constitution); An addition (to the Constitution)", section: "Principles" },
  { id: 5, q: "What do we call the first ten amendments to the Constitution?", a: "The Bill of Rights", section: "Principles" },
  { id: 6, q: "What is one right or freedom from the First Amendment?", a: "Speech; Religion; Assembly; Press; Petition the government", section: "Principles" },
  { id: 7, q: "How many amendments does the Constitution have?", a: "Twenty-seven (27)", section: "Principles" },
  { id: 8, q: "What did the Declaration of Independence do?", a: "Announced our independence (from Great Britain); Declared our independence (from Great Britain); Said that the United States is free (from Great Britain)", section: "Principles" },
  { id: 9, q: "What are two rights in the Declaration of Independence?", a: "Life; Liberty; Pursuit of happiness", section: "Principles" },
  { id: 10, q: "What is freedom of religion?", a: "You can practice any religion, or not practice a religion", section: "Principles" },
  { id: 11, q: "What is the economic system in the United States?", a: "Capitalist economy; Market economy", section: "Principles" },
  { id: 12, q: "What is the 'rule of law'?", a: "Everyone must follow the law; Leaders must obey the law; Government must obey the law; No one is above the law", section: "Principles" },

  // B: System of Government
  { id: 13, q: "Name one branch or part of the government.", a: "Congress; Legislative; President; Executive; The courts; Judicial", section: "System of Gov" },
  { id: 14, q: "What stops one branch of government from becoming too powerful?", a: "Checks and balances; Separation of powers", section: "System of Gov" },
  { id: 15, q: "Who is in charge of the executive branch?", a: "The President", section: "System of Gov" },
  { id: 16, q: "Who makes federal laws?", a: "Congress; Senate and House (of Representatives); (U.S. or national) legislature", section: "System of Gov" },
  { id: 17, q: "What are the two parts of the U.S. Congress?", a: "The Senate and House (of Representatives)", section: "System of Gov" },
  { id: 18, q: "How many U.S. Senators are there?", a: "One hundred (100)", section: "System of Gov" },
  { id: 19, q: "We elect a U.S. Senator for how many years?", a: "Six (6)", section: "System of Gov" },
  { id: 20, q: "Who is one of your state's U.S. Senators now?", a: "Answers will vary by state", section: "System of Gov" },
  { id: 21, q: "The House of Representatives has how many voting members?", a: "Four hundred thirty-five (435)", section: "System of Gov" },
  { id: 22, q: "We elect a U.S. Representative for how many years?", a: "Two (2)", section: "System of Gov" },
  { id: 23, q: "Name your U.S. Representative.", a: "Answers will vary by district", section: "System of Gov" },
  { id: 24, q: "Who does a U.S. Senator represent?", a: "All people of the state", section: "System of Gov" },
  { id: 25, q: "Why do some states have more Representatives than other states?", a: "(Because of) the state's population; (Because) they have more people; (Because) some states have more people", section: "System of Gov" },
  { id: 26, q: "We elect a President for how many years?", a: "Four (4)", section: "System of Gov" },
  { id: 27, q: "In what month do we vote for President?", a: "November", section: "System of Gov" },
  { id: 28, q: "What is the name of the President of the United States now?", a: "Answers will vary", section: "System of Gov" },
  { id: 29, q: "What is the name of the Vice President of the United States now?", a: "Answers will vary", section: "System of Gov" },
  { id: 30, q: "If the President can no longer serve, who becomes President?", a: "The Vice President", section: "System of Gov" },
  { id: 31, q: "If both the President and the Vice President can no longer serve, who becomes President?", a: "The Speaker of the House", section: "System of Gov" },
  { id: 32, q: "Who is the Commander in Chief of the military?", a: "The President", section: "System of Gov" },
  { id: 33, q: "Who signs bills to become laws?", a: "The President", section: "System of Gov" },
  { id: 34, q: "Who vetoes bills?", a: "The President", section: "System of Gov" },
  { id: 35, q: "What does the President's Cabinet do?", a: "Advises the President", section: "System of Gov" },
  { id: 36, q: "What are two Cabinet-level positions?", a: "Secretary of Agriculture; Secretary of Commerce; Secretary of Defense; Secretary of Education; Secretary of Energy; Secretary of Health and Human Services; Secretary of Homeland Security; Secretary of Housing and Urban Development; Secretary of the Interior; Secretary of Labor; Secretary of State; Secretary of Transportation; Secretary of the Treasury; Secretary of Veterans Affairs; Attorney General; Vice President", section: "System of Gov" },
  { id: 37, q: "What does the judicial branch do?", a: "Reviews laws; Explains laws; Resolves disputes (disagreements); Decides if a law goes against the Constitution", section: "System of Gov" },
  { id: 38, q: "What is the highest court in the United States?", a: "The Supreme Court", section: "System of Gov" },
  { id: 39, q: "How many justices are on the Supreme Court?", a: "Nine (9)", section: "System of Gov" },
  { id: 40, q: "Who is the Chief Justice of the United States now?", a: "Answers will vary", section: "System of Gov" },
  { id: 41, q: "Under our Constitution, some powers belong to the federal government. What is one power of the federal government?", a: "To print money; To declare war; To create an army; To make treaties", section: "System of Gov" },
  { id: 42, q: "Under our Constitution, some powers belong to the states. What is one power of the states?", a: "Provide schooling and education; Provide protection (police); Provide safety (fire departments); Give a driver's license; Approve zoning and land use", section: "System of Gov" },
  { id: 43, q: "Who is the Governor of your state now?", a: "Answers will vary by state", section: "System of Gov" },
  { id: 44, q: "What is the capital of your state?", a: "Answers will vary by state", section: "System of Gov" },
  { id: 45, q: "What are the two major political parties in the United States?", a: "Democratic and Republican", section: "System of Gov" },
  { id: 46, q: "What is the political party of the President now?", a: "Answers will vary", section: "System of Gov" },
  { id: 47, q: "What is the name of the Speaker of the House of Representatives now?", a: "Answers will vary", section: "System of Gov" },

  // C: Rights and Responsibilities
  { id: 48, q: "There are four amendments to the Constitution about who can vote. Describe one of them.", a: "Citizens eighteen (18) and older (can vote); You don't have to pay (a poll tax) to vote; Any citizen can vote. (Women and men can vote.); A male citizen of any race (can vote)", section: "Rights" },
  { id: 49, q: "What is one responsibility that is only for United States citizens?", a: "Serve on a jury; Vote in a federal election", section: "Rights" },
  { id: 50, q: "Name one right only for United States citizens.", a: "Vote in a federal election; Run for federal office", section: "Rights" },
  { id: 51, q: "What are two rights of everyone living in the United States?", a: "Freedom of expression; Freedom of speech; Freedom of assembly; Freedom to petition the government; Freedom of religion; The right to bear arms", section: "Rights" },
  { id: 52, q: "What do we show loyalty to when we say the Pledge of Allegiance?", a: "The United States; The flag", section: "Rights" },
  { id: 53, q: "What is one promise you make when you become a United States citizen?", a: "Give up loyalty to other countries; Defend the Constitution and laws of the United States; Obey the laws of the United States; Serve in the U.S. military (if needed); Serve (do important work for) the nation (if needed); Be loyal to the United States", section: "Rights" },
  { id: 54, q: "How old do citizens have to be to vote for President?", a: "Eighteen (18) and older", section: "Rights" },
  { id: 55, q: "What are two ways that Americans can participate in their democracy?", a: "Vote; Join a political party; Help with a campaign; Join a civic group; Join a community group; Give an elected official your opinion on an issue; Call Senators and Representatives; Publicly support or oppose an issue or policy; Run for office; Write to a newspaper", section: "Rights" },
  { id: 56, q: "When is the last day you can send in federal income tax forms?", a: "April 15", section: "Rights" },
  { id: 57, q: "When must all men register for the Selective Service?", a: "At age eighteen (18); Between eighteen (18) and twenty-six (26)", section: "Rights" },

  // AMERICAN HISTORY
  // A: Colonial Period and Independence
  { id: 58, q: "What is one reason colonists came to America?", a: "Freedom; Political liberty; Religious freedom; Economic opportunity; Practice their religion; Escape persecution", section: "Colonial" },
  { id: 59, q: "Who lived in America before the Europeans arrived?", a: "American Indians; Native Americans", section: "Colonial" },
  { id: 60, q: "What group of people was taken to America and sold as slaves?", a: "Africans; People from Africa", section: "Colonial" },
  { id: 61, q: "Why did the colonists fight the British?", a: "Because of high taxes (taxation without representation); Because the British army stayed in their houses (boarding, quartering); Because they didn't have self-government", section: "Colonial" },
  { id: 62, q: "Who wrote the Declaration of Independence?", a: "(Thomas) Jefferson", section: "Colonial" },
  { id: 63, q: "When was the Declaration of Independence adopted?", a: "July 4, 1776", section: "Colonial" },
  { id: 64, q: "There were 13 original states. Name three.", a: "New Hampshire; Massachusetts; Rhode Island; Connecticut; New York; New Jersey; Pennsylvania; Delaware; Maryland; Virginia; North Carolina; South Carolina; Georgia", section: "Colonial" },
  { id: 65, q: "What happened at the Constitutional Convention?", a: "The Constitution was written; The Founding Fathers wrote the Constitution", section: "Colonial" },
  { id: 66, q: "When was the Constitution written?", a: "1787", section: "Colonial" },
  { id: 67, q: "The Federalist Papers supported the passage of the U.S. Constitution. Name one of the writers.", a: "(James) Madison; (Alexander) Hamilton; (John) Jay; Publius", section: "Colonial" },
  { id: 68, q: "What is one thing Benjamin Franklin is famous for?", a: "U.S. diplomat; Oldest member of the Constitutional Convention; First Postmaster General of the United States; Writer of 'Poor Richard's Almanac'; Started the first free libraries", section: "Colonial" },
  { id: 69, q: "Who is the 'Father of Our Country'?", a: "(George) Washington", section: "Colonial" },
  { id: 70, q: "Who was the first President?", a: "(George) Washington", section: "Colonial" },

  // B: 1800s
  { id: 71, q: "What territory did the United States buy from France in 1803?", a: "The Louisiana Territory; Louisiana", section: "1800s" },
  { id: 72, q: "Name one war fought by the United States in the 1800s.", a: "War of 1812; Mexican-American War; Civil War; Spanish-American War", section: "1800s" },
  { id: 73, q: "Name the U.S. war between the North and the South.", a: "The Civil War; The War between the States", section: "1800s" },
  { id: 74, q: "Name one problem that led to the Civil War.", a: "Slavery; Economic reasons; States' rights", section: "1800s" },
  { id: 75, q: "What was one important thing that Abraham Lincoln did?", a: "Freed the slaves (Emancipation Proclamation); Saved (or preserved) the Union; Led the United States during the Civil War", section: "1800s" },
  { id: 76, q: "What did the Emancipation Proclamation do?", a: "Freed the slaves; Freed slaves in the Confederacy; Freed slaves in the Confederate states; Freed slaves in most Southern states", section: "1800s" },
  { id: 77, q: "What did Susan B. Anthony do?", a: "Fought for women's rights; Fought for civil rights", section: "1800s" },

  // C: Recent American History and Other Important Historical Information
  { id: 78, q: "Name one war fought by the United States in the 1900s.", a: "World War I; World War II; Korean War; Vietnam War; (Persian) Gulf War", section: "1900s" },
  { id: 79, q: "Who was President during World War I?", a: "(Woodrow) Wilson", section: "1900s" },
  { id: 80, q: "Who was President during the Great Depression and World War II?", a: "(Franklin) Roosevelt", section: "1900s" },
  { id: 81, q: "Who did the United States fight in World War II?", a: "Japan, Germany, and Italy", section: "1900s" },
  { id: 82, q: "Before he was President, Eisenhower was a general. What war was he in?", a: "World War II", section: "1900s" },
  { id: 83, q: "During the Cold War, what was the main concern of the United States?", a: "Communism", section: "1900s" },
  { id: 84, q: "What movement tried to end racial discrimination?", a: "Civil rights (movement)", section: "1900s" },
  { id: 85, q: "What did Martin Luther King, Jr. do?", a: "Fought for civil rights; Worked for equality for all Americans", section: "1900s" },
  { id: 86, q: "What major event happened on September 11, 2001, in the United States?", a: "Terrorists attacked the United States", section: "1900s" },
  { id: 87, q: "Name one American Indian tribe in the United States.", a: "Cherokee; Navajo; Sioux; Chippewa; Choctaw; Pueblo; Apache; Iroquois; Creek; Blackfeet; Seminole; Cheyenne; Arawak; Shawnee; Mohegan; Huron; Oneida; Lakota; Crow; Teton; Hopi; Inuit", section: "1900s" },

  // INTEGRATED CIVICS
  // A: Geography
  { id: 88, q: "Name one of the two longest rivers in the United States.", a: "Missouri (River); Mississippi (River)", section: "Geography" },
  { id: 89, q: "What ocean is on the West Coast of the United States?", a: "Pacific (Ocean)", section: "Geography" },
  { id: 90, q: "What ocean is on the East Coast of the United States?", a: "Atlantic (Ocean)", section: "Geography" },
  { id: 91, q: "Name one U.S. territory.", a: "Puerto Rico; U.S. Virgin Islands; American Samoa; Northern Mariana Islands; Guam", section: "Geography" },
  { id: 92, q: "Name one state that borders Canada.", a: "Maine; New Hampshire; Vermont; New York; Pennsylvania; Ohio; Michigan; Minnesota; North Dakota; Montana; Idaho; Washington; Alaska", section: "Geography" },
  { id: 93, q: "Name one state that borders Mexico.", a: "California; Arizona; New Mexico; Texas", section: "Geography" },
  { id: 94, q: "What is the capital of the United States?", a: "Washington, D.C.", section: "Geography" },
  { id: 95, q: "Where is the Statue of Liberty?", a: "New York (Harbor); Liberty Island; [Also acceptable: New Jersey, near New York City, on the Hudson (River)]", section: "Geography" },

  // B: Symbols
  { id: 96, q: "Why does the flag have 13 stripes?", a: "Because there were 13 original colonies; Because the stripes represent the original colonies", section: "Symbols" },
  { id: 97, q: "Why does the flag have 50 stars?", a: "Because there is one star for each state; Because each star represents a state; Because there are 50 states", section: "Symbols" },
  { id: 98, q: "What is the name of the national anthem?", a: "The Star-Spangled Banner", section: "Symbols" },

  // C: Holidays
  { id: 99, q: "When do we celebrate Independence Day?", a: "July 4", section: "Holidays" },
  { id: 100, q: "Name two national U.S. holidays.", a: "New Year's Day; Martin Luther King, Jr. Day; Presidents' Day; Memorial Day; Independence Day; Labor Day; Columbus Day; Veterans Day; Thanksgiving; Christmas", section: "Holidays" },
];

export default CIVICS_QUESTIONS;
