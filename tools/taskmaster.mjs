import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const PRD_PATH = process.env.PRD_PATH || 'docs/PRD.md';
const OUT_DIR  = process.env.OUT_DIR  || 'tasks';

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s\-]/g, '').trim().replace(/\s+/g, '-').slice(0, 60);
}

function parsePRD(md) {
  const lines = md.split(/\n/);
  const sections = [];
  let currentSection = null;
  let currentTask = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Section headers (## 1) Authentication, ## 2) Onboarding, etc.)
    if (line.match(/^## \d+\)/)) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        id: slugify(line.replace(/^## \d+\)\s*/, '')),
        title: line.replace(/^## \d+\)\s*/, ''),
        description: '',
        tasks: [],
        acceptance: []
      };
    }
    // Task items (- [ ] Task description)
    else if (line.match(/^- \[ \]/)) {
      if (currentSection) {
        currentSection.tasks.push({
          id: slugify(line.replace(/^- \[ \]\s*/, '')),
          title: line.replace(/^- \[ \]\s*/, ''),
          status: 'pending',
          description: ''
        });
      }
    }
    // Acceptance criteria (### Acceptance)
    else if (line.match(/^### Acceptance/)) {
      // Read next lines until empty line or next section
      let j = i + 1;
      while (j < lines.length && lines[j].trim() && !lines[j].match(/^##/)) {
        if (currentSection) {
          currentSection.acceptance.push(lines[j].replace(/^-\s*/, '').trim());
        }
        j++;
      }
    }
    // Description text
    else if (currentSection && line.trim() && !line.match(/^#/) && !line.match(/^-/)) {
      if (currentSection.description) {
        currentSection.description += ' ' + line.trim();
      } else {
        currentSection.description = line.trim();
      }
    }
  }
  
  if (currentSection) sections.push(currentSection);
  return sections;
}

function generateTaskFiles(sections) {
  // Clean output directory
  if (existsSync(OUT_DIR)) {
    rmSync(OUT_DIR, { recursive: true });
  }
  mkdirSync(OUT_DIR, { recursive: true });
  
  // Generate main README
  const readme = `# AstroMatch Task Management

## 📊 Project Overview
- **Total Sections**: ${sections.length}
- **Total Tasks**: ${sections.reduce((sum, s) => sum + s.tasks.length, 0)}
- **Status**: In Development

## 🎯 Current Sprint: Core Foundation

### 🔥 High Priority
${sections.slice(0, 3).map(s => `- **${s.title}** (${s.tasks.length} tasks)`).join('\n')}

### 📋 Medium Priority  
${sections.slice(3, 6).map(s => `- **${s.title}** (${s.tasks.length} tasks)`).join('\n')}

### 🔄 Low Priority
${sections.slice(6).map(s => `- **${s.title}** (${s.tasks.length} tasks)`).join('\n')}

## 📁 Task Files
- \`sprint-1.md\` - Current sprint details
- \`daily-standup.md\` - Daily progress tracking
- \`sections/\` - Individual section breakdowns

## 🚀 Quick Start
1. Review \`sprint-1.md\` for current priorities
2. Use \`daily-standup.md\` for daily progress
3. Check individual section files for detailed tasks
`;

  writeFileSync(resolve(OUT_DIR, 'README.md'), readme);
  
  // Generate sprint file
  const sprint1 = `# Sprint 1: Core Foundation

## 🎯 Sprint Goals
- Complete authentication system
- Finish onboarding flow  
- Complete matching engine
- Basic app functionality working

## 📅 Timeline
- **Start**: Week 1
- **End**: Week 2
- **Duration**: 2 weeks

## 🔥 Critical Tasks

### Authentication System
${sections.find(s => s.id.includes('authentication'))?.tasks.map(t => `- [ ] ${t.title}`).join('\n') || '- [ ] Set up Supabase authentication'}

### Onboarding Flow
${sections.find(s => s.id.includes('onboarding'))?.tasks.map(t => `- [ ] ${t.title}`).join('\n') || '- [ ] Build profile setup form'}

### Matching Engine
${sections.find(s => s.id.includes('matching'))?.tasks.map(t => `- [ ] ${t.title}`).join('\n') || '- [ ] Complete compatibility calculations'}

## 📊 Success Metrics
- [ ] User can sign up and log in
- [ ] Profile setup works end-to-end
- [ ] Compatibility calculations are accurate
- [ ] App runs without errors
`;

  writeFileSync(resolve(OUT_DIR, 'sprint-1.md'), sprint1);
  
  // Generate daily standup template
  const standup = `# Daily Standup Template

## 📅 Date: [Today's Date]

## 🎯 Yesterday's Accomplishments
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## 🎯 Today's Goals
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## 🚨 Blockers/Issues
- [ ] Issue 1
- [ ] Issue 2

## 📊 Progress Update
- **Sprint Progress**: X% complete
- **Tasks Completed**: X of Y
- **Next Priority**: [Next task]

## 💡 Notes
- Any additional notes or insights
`;

  writeFileSync(resolve(OUT_DIR, 'daily-standup.md'), standup);
  
  // Generate individual section files
  mkdirSync(resolve(OUT_DIR, 'sections'), { recursive: true });
  
  sections.forEach(section => {
    const sectionFile = `# ${section.title}

## 📝 Description
${section.description}

## ✅ Tasks
${section.tasks.map(t => `- [ ] ${t.title}`).join('\n')}

## 🎯 Acceptance Criteria
${section.acceptance.map(a => `- ${a}`).join('\n')}

## 📊 Progress
- **Total Tasks**: ${section.tasks.length}
- **Completed**: 0
- **In Progress**: 0
- **Pending**: ${section.tasks.length}

## 🚀 Next Actions
1. Review task list
2. Prioritize by importance
3. Start with first task
4. Update progress regularly
`;

    writeFileSync(resolve(OUT_DIR, 'sections', `${section.id}.md`), sectionFile);
  });
  
  console.log(`✅ Generated task management files in ${OUT_DIR}/`);
  console.log(`📁 Created ${sections.length} section files`);
  console.log(`📋 Total tasks: ${sections.reduce((sum, s) => sum + s.tasks.length, 0)}`);
}

// Main execution
try {
  console.log('🚀 AstroMatch TaskMaster Starting...');
  console.log(`📖 Reading PRD from: ${PRD_PATH}`);
  
  const prdContent = readFileSync(PRD_PATH, 'utf8');
  const sections = parsePRD(prdContent);
  
  console.log(`📊 Parsed ${sections.length} sections from PRD`);
  
  generateTaskFiles(sections);
  
  console.log('✅ TaskMaster complete!');
  console.log('📁 Check the tasks/ directory for your organized task files');
  
} catch (error) {
  console.error('❌ TaskMaster error:', error.message);
  process.exit(1);
}
