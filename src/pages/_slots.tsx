'use client'

import { MdxPageContext } from 'vocs'

/*
 * Right-rail slot, rendered under "Copy page for AI": a GitHub edit link for
 * the current page's source file, styled to match the copy-for-AI button.
 */
export function OutlineFooter() {
  const { frontmatter } = MdxPageContext.use()
  const filePath = frontmatter?.filePath as string | undefined

  if (!filePath) return null

  return (
    <a
      className="outline-edit-link vocs:flex vocs:items-center vocs:gap-2 vocs:text-[13px] vocs:text-secondary vocs:hover:text-heading vocs:cursor-pointer vocs:transition-colors"
      href={`https://github.com/0xSplits/splits-docs/edit/main/src/pages/${filePath}`}
    >
      <svg
        aria-hidden="true"
        fill="none"
        height="16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="16"
      >
        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
        <path d="m15 5 4 4" />
      </svg>
      <span>Edit this page</span>
    </a>
  )
}
