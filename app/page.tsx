import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

interface MessageData {
  enabled: boolean;
  title?: string;
  content?: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

// Function to get the message box data
async function getMessageBoxData(): Promise<MessageData | null> {
  const filePath = path.join(process.cwd(), 'content', 'settings', 'global-message.md');

  // Check if the file exists before trying to read it
  if (!fs.existsSync(filePath)) {
    console.warn(`Message box file not found at: ${filePath}`);
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  // Convert markdown content to HTML
  let contentHtml = '';
  if (content) {
    const processedContent = await remark().use(html).process(content);
    contentHtml = processedContent.toString();
  }

  return {
    enabled: data.enabled || false,
    title: data.title || '',
    content: contentHtml,
    type: data.type || 'info', // Default to 'info' if not specified
  };
}

export default async function HomePage() {
  const messageBox = await getMessageBoxData();

  return (
    <div>
      {/* Message Box */}
      {messageBox?.enabled && messageBox.content && (
        <div className={`message-box message-box--${messageBox.type}`}>
          {messageBox.title && <h3>{messageBox.title}</h3>}
          <div dangerouslySetInnerHTML={{ __html: messageBox.content }} />
        </div>
      )}

      {/* Your existing page content */}
      <h1>Welcome to My Next.js App!</h1>
      <p>This is the main content of your homepage.</p>
      {/* ... other page content ... */}
    </div>
  );
}
