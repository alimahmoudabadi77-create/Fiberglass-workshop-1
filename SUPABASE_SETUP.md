# راه‌اندازی Supabase برای گالری دائمی

برای اینکه عکس‌ها و ویدیوهای گالری برای همیشه ذخیره شوند و در هر دستگاه و مرورگری قابل مشاهده باشند، باید Supabase را راه‌اندازی کنید.

## مراحل راه‌اندازی

### ۱. ساخت پروژه Supabase
1. به [supabase.com](https://supabase.com) بروید و یک حساب رایگان بسازید
2. یک پروژه جدید ایجاد کنید
3. از بخش **Settings > API** مقادیر زیر را کپی کنید:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### ۲. ایجاد جدول گالری
در Supabase به **SQL Editor** بروید و این کوئری را اجرا کنید:

```sql
CREATE TABLE gallery (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  storage_path TEXT
);

-- امکان خواندن برای همه (برای نمایش در سایت)
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON gallery
  FOR SELECT USING (true);

-- امکان اضافه/ویرایش/حذف برای کاربران احراز هویت شده (اختیاری - فعلاً همه می‌توانند)
CREATE POLICY "Allow all insert" ON gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON gallery FOR UPDATE USING (true);
CREATE POLICY "Allow all delete" ON gallery FOR DELETE USING (true);
```

### ۳. ایجاد Storage Bucket
1. به **Storage** در داشبورد Supabase بروید
2. روی **New bucket** کلیک کنید
3. نام bucket را `gallery` قرار دهید
4. گزینه **Public bucket** را فعال کنید (تا تصاویر برای بازدیدکنندگان قابل مشاهده باشند)
5. در تنظیمات bucket، **Policies** را باز کنید و یک policy برای INSERT و DELETE اضافه کنید:

```sql
-- برای آپلود فایل
CREATE POLICY "Allow public upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'gallery');

-- برای حذف فایل
CREATE POLICY "Allow public delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'gallery');

-- برای خواندن (مشاهده تصاویر)
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');
```

### ۴. تنظیم متغیرهای محیطی
یک فایل `.env.local` در ریشه پروژه بسازید و مقادیر زیر را قرار دهید:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### ۵. استقرار با GitHub Pages
اگر از GitHub Actions برای deploy استفاده می‌کنید، در تنظیمات مخزن (Settings > Secrets and variables > Actions) این دو Secret را اضافه کنید:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

سپس در فایل `deploy.yml` در مرحله Build، متغیرهای محیطی را اضافه کنید:
```yaml
- name: Build with Next.js
  run: npm run build
  env:
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
    NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

---

> **توجه:** اگر Supabase را راه‌اندازی نکنید، گالری همچنان با localStorage کار می‌کند؛ اما فقط روی همان مرورگری که آپلود شده قابل مشاهده خواهد بود.
