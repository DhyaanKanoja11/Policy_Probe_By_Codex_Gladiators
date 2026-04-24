import re

with open('policy-probe-app/src/app/analyze/page.tsx', 'r') as f:
    code = f.read()

# Import LoadingSkeleton
if "LoadingSkeleton" not in code:
    code = code.replace("import { useRouter } from 'next/navigation';", "import { useRouter } from 'next/navigation';\nimport LoadingSkeleton from '@/components/results/LoadingSkeleton';")

# Return LoadingSkeleton if loading
render_block = """  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
"""
code = code.replace("  return (\n    <Box sx={{ py: { xs: 6, md: 10 },", render_block + "    <Box sx={{ py: { xs: 6, md: 10 },")

with open('policy-probe-app/src/app/analyze/page.tsx', 'w') as f:
    f.write(code)
