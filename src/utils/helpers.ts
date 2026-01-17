import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { ja } from 'date-fns/locale';

/**
 * メッセージのタイムスタンプをフォーマット
 */
export function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);

  if (isToday(date)) {
    return format(date, 'HH:mm');
  }

  if (isYesterday(date)) {
    return `昨日 ${format(date, 'HH:mm')}`;
  }

  return format(date, 'M/d HH:mm');
}

/**
 * 最終オンライン時間をフォーマット
 */
export function formatLastSeen(dateString: string | null): string {
  if (!dateString) return 'オフライン';

  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: ja });
}

/**
 * 会話リストの日付をフォーマット
 */
export function formatConversationDate(dateString: string): string {
  const date = new Date(dateString);

  if (isToday(date)) {
    return format(date, 'HH:mm');
  }

  if (isYesterday(date)) {
    return '昨日';
  }

  return format(date, 'M/d');
}

/**
 * ファイルサイズをフォーマット
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * ユーザー名の頭文字を取得（アバター用）
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
