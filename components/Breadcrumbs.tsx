import Link from 'next/link';

export interface Crumb {
  name: string;
  href?: string;
}

/** Breadcrumb visual. Data JSON-LD-nya dibuat terpisah dengan breadcrumbJsonLd(). */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-slate-500 dark:text-slate-400">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={`${item.name}-${i}`} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-pitch-600">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-slate-700 dark:text-slate-300">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
