from langchain import OpenAI, LLMChain, PromptTemplate

template = """
Automation Task:
{task}

Automation Steps:
"""

prompt = PromptTemplate(template=template, input_variables=["task"])

llm = OpenAI(temperature=0)

chain = LLMChain(llm=llm, prompt=prompt)

task = "Enhance the website's performance by optimizing images and minifying CSS and JavaScript files."

result = chain.run(task)

print(result)
